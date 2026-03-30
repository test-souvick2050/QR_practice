import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timeConverter } from '@/utils/time';
import supabase from '@/configs/supabse';
import useAuthStore from '@/store/authStore';
import logger from '@/utils/logger';
import llamaApi from '@/configs/llamaApi';

interface CreateManufacturerInput {
  connection_type: string;
  name: string;
  sftp_host: string;
  sftp_port: number | null;
  sftp_location: string;
  sftp_username: string;
  sftp_auth_type: 'password' | 'ssh_key';
  sftp_password: string;
  store_location_id: string;
}

interface UpdateManufacturerInput {
  connection_type: string;
  name: string;
  sftp_host: string;
  sftp_port: number | null;
  sftp_location: string;
  sftp_username: string;
  sftp_auth_type: 'password' | 'ssh_key';
  sftp_password: string;
  store_location_id: string;
}

interface TestEDIConnectionInput {
  host: string;
  port: number;
  username: string;
  password?: string;
  auth_type: 'password' | 'file';
  file_location: string;
  file: File | null;
}

type DecryptPasswordResponse = {
  plain: string;
};

// * ====================== Fetch All Manufacturers ====================== *
const fetchAllManufacturers = async () => {
  const { data, error } = await supabase
    .from('manufacturers')
    .select(
      `
      *,
      store_location:store_locations(
        id, name
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const useFetchAllManufacturers = () => {
  return useQuery({
    queryKey: ['manufacturers'],
    queryFn: fetchAllManufacturers,
    staleTime: timeConverter(20, 'minute'),
  });
};

// * ====================== Fetch Single Manufacturer ====================== *
const fetchSingleManufacturer = async (manufacturerId: string) => {
  const { data, error } = await supabase
    .from('manufacturers')
    .select(
      `
      *,
      store_location:store_locations(
        id, name
      )
    `
    )
    .eq('id', manufacturerId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const useFetchSingleManufacturer = (manufacturerId?: string) => {
  return useQuery({
    queryKey: ['manufacturer', manufacturerId],
    queryFn: () => fetchSingleManufacturer(manufacturerId!),
    enabled: !!manufacturerId,
    staleTime: timeConverter(10, 'minute'),
  });
};

const encryptPassword = async (plainPassword: string) => {
  const { data, error } = await supabase.functions.invoke('encrypt-password', {
    body: { plain: plainPassword },
  });

  if (error) throw error;
  return data as { encryptedPassword: string; iv: string };
};

// * ====================== Create Manufacturer ====================== *
const createManufacturer = async (
  manufacturerData: CreateManufacturerInput,
  sftp_ssh_key_file: File | null
) => {
  const userProfile = useAuthStore.getState().userProfile;
  const {
    connection_type,
    name,
    sftp_host,
    sftp_port,
    sftp_location,
    sftp_username,
    sftp_auth_type,
    sftp_password,
  } = manufacturerData;

  const store_location_id = manufacturerData.store_location_id
    ? manufacturerData.store_location_id
    : null;

  let encryptedPassword: string | null = null;
  let iv: string | null = null;

  if (sftp_auth_type === 'password' && sftp_password) {
    const encrypted = await encryptPassword(sftp_password);
    encryptedPassword = encrypted.encryptedPassword;
    iv = encrypted.iv;
  }

  let sftp_ssh_key_file_url: string | null = null;

  if (sftp_auth_type === 'ssh_key' && sftp_ssh_key_file) {
    const filePath = `ssh-keys/${Date.now()}-${sftp_ssh_key_file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('store-bucket')
      .upload(filePath, sftp_ssh_key_file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrl } = supabase.storage.from('store-bucket').getPublicUrl(filePath);

    sftp_ssh_key_file_url = publicUrl?.publicUrl || null;
  }

  const { data, error } = await supabase.from('manufacturers').insert({
    store_location_id,
    connection_type,
    name,
    sftp_host,
    sftp_port,
    sftp_location,
    sftp_username,
    sftp_auth_type,
    sftp_password: encryptedPassword,
    sftp_password_iv: iv,
    sftp_ssh_key_file_url,
    created_by_user_id: userProfile?.id,
    updated_by_user_id: userProfile?.id,
  });

  if (error) {
    throw error;
  }

  return { success: true, data };
};

export const useCreateManufacturer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      manufacturerData,
      sftp_ssh_key_file,
    }: {
      manufacturerData: CreateManufacturerInput;
      sftp_ssh_key_file: File | null;
    }) => createManufacturer(manufacturerData, sftp_ssh_key_file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturers'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['stores'], exact: false });
    },
  });
};

// * ====================== Delete Manufacturer ====================== *
export const deleteManufacturer = async (manufacturerId: string) => {
  if (!manufacturerId) throw new Error('Manufacturer cannot be fetched');

  // 1. Fetch the record first to get the file URL
  const { data: manufacturer, error: fetchError } = await supabase
    .from('manufacturers')
    .select('sftp_ssh_key_file_url')
    .eq('id', manufacturerId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  const fileUrl = manufacturer?.sftp_ssh_key_file_url;

  if (fileUrl) {
    try {
      // 2. Extract storage path from the public URL
      const url = new URL(fileUrl);
      const pathSegments = url.pathname.split('/');
      const filePathIndex = pathSegments.findIndex((segment) => segment === 'ssh-keys');
      const filePath = pathSegments.slice(filePathIndex).join('/'); // ssh-keys/filename

      // 3. Delete the file from storage
      const { error: fileDeleteError } = await supabase.storage
        .from('store-bucket')
        .remove([filePath]);

      if (fileDeleteError) throw new Error('File deletion failed');
    } catch (err) {
      logger.warn('Could not parse or delete file:', err);
    }
  }

  // 4. Delete the manufacturer row
  const { error: manufacturerDeleteError } = await supabase
    .from('manufacturers')
    .delete()
    .eq('id', manufacturerId);

  if (manufacturerDeleteError) throw manufacturerDeleteError;

  return { success: true };
};

export const useDeleteManufacturer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteManufacturer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturers'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['stores'], exact: false });
    },
  });
};

// * ====================== Fetch Manufacturer Password ====================== *
export const useDecryptManufacturerPasswordMutation = () => {
  return useMutation({
    mutationFn: async (manufacturerId: string): Promise<string> => {
      const { data: manufacturerData, error: fetchError } = await supabase
        .from('manufacturers')
        .select('sftp_password, sftp_password_iv')
        .eq('id', manufacturerId)
        .maybeSingle();

      if (fetchError || !manufacturerData) {
        throw new Error(fetchError?.message || 'Failed to fetch manufacturer');
      }

      const { data, error: decryptError } =
        await supabase.functions.invoke<DecryptPasswordResponse>('decrypt-password', {
          body: {
            encryptedPassword: manufacturerData.sftp_password,
            iv: manufacturerData.sftp_password_iv,
          },
        });

      if (decryptError || !data?.plain) {
        throw new Error(decryptError?.message || 'Decryption failed');
      }

      return data.plain;
    },
  });
};

// * ====================== Update Manufacturer ====================== *
const updateManufacturer = async (
  manufacturerId: string,
  manufacturerData: UpdateManufacturerInput,
  sftp_ssh_key_file: File | null
) => {
  const userProfile = useAuthStore.getState().userProfile;
  if (!userProfile?.id) throw new Error('User not authenticated');

  const {
    connection_type,
    name,
    sftp_host,
    sftp_port,
    sftp_location,
    sftp_username,
    sftp_auth_type,
    sftp_password,
  } = manufacturerData;

  const store_location_id = manufacturerData.store_location_id
    ? manufacturerData.store_location_id
    : null;

  // 1. Check for duplicate name (excluding current manufacturer)
  const { data: existing, error: existingError } = await supabase
    .from('manufacturers')
    .select('id')
    .eq('name', name)
    .neq('id', manufacturerId)
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) throw new Error('A manufacturer with this name already exists');

  // 2. Fetch existing manufacturer record (to get old file URL if needed)
  const { data: oldRecord, error: fetchError } = await supabase
    .from('manufacturers')
    .select('sftp_ssh_key_file_url')
    .eq('id', manufacturerId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  // 3. Encrypt password if needed
  let encryptedPassword: string | undefined;
  let iv: string | undefined;

  // Delete old key if it exists
  if (
    (sftp_auth_type === 'ssh_key' && sftp_ssh_key_file) ||
    (sftp_auth_type === 'password' && sftp_password)
  ) {
    const oldUrl = oldRecord?.sftp_ssh_key_file_url;
    if (oldUrl) {
      const [, bucketAndPath] = oldUrl.split('/object/public/');
      if (bucketAndPath) {
        const pathParts = bucketAndPath.split('/');
        const filePathToDelete = pathParts.slice(1).join('/');
        await supabase.storage.from('store-bucket').remove([filePathToDelete]);
      }
    }
  }

  if (sftp_auth_type === 'password' && sftp_password) {
    const encrypted = await encryptPassword(sftp_password);
    encryptedPassword = encrypted.encryptedPassword;
    iv = encrypted.iv;
  }

  // 4. Handle SSH Key upload & delete old key if replacing
  let sftp_ssh_key_file_url: string | undefined;

  if (sftp_auth_type === 'ssh_key' && sftp_ssh_key_file) {
    // Upload new key
    const filePath = `ssh-keys/${Date.now()}-${sftp_ssh_key_file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('store-bucket')
      .upload(filePath, sftp_ssh_key_file);

    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage.from('store-bucket').getPublicUrl(filePath);
    sftp_ssh_key_file_url = publicUrl?.publicUrl || undefined;
  }

  // 5. Perform update
  const { error: updateError } = await supabase
    .from('manufacturers')
    .update({
      store_location_id,
      connection_type,
      name,
      sftp_host,
      sftp_port,
      sftp_location,
      sftp_username,
      sftp_auth_type,
      ...(sftp_ssh_key_file_url
        ? { sftp_password: null }
        : encryptedPassword && { sftp_password: encryptedPassword }),
      ...(sftp_ssh_key_file_url ? { sftp_password_iv: null } : iv && { sftp_password_iv: iv }),
      ...(encryptedPassword
        ? { sftp_ssh_key_file_url: null }
        : sftp_ssh_key_file_url && { sftp_ssh_key_file_url }),
      updated_by_user_id: userProfile.id,
    })
    .eq('id', manufacturerId);

  if (updateError) throw updateError;

  return { success: true };
};

export const useUpdateManufacturer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      manufacturerId,
      manufacturerData,
      sftp_ssh_key_file,
    }: {
      manufacturerId: string;
      manufacturerData: UpdateManufacturerInput;
      sftp_ssh_key_file: File | null;
    }) => updateManufacturer(manufacturerId, manufacturerData, sftp_ssh_key_file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturers'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['manufacturer'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['stores'], exact: false });
    },
  });
};

// * ====================== Fetch Store Locations for Create/Edit ====================== *
export const fetchAllStoreLocations = async () => {
  // Get all store locations
  const { data: storeLocations, error: storeLocationsError } = await supabase
    .from('store_locations')
    .select('id, name, status')
    .eq('status', 'active');

  if (storeLocationsError) throw storeLocationsError;

  const result = storeLocations;

  return result;
};

export const useFetchAllStoreLocations = () => {
  return useQuery({
    queryKey: ['store-locations'],
    queryFn: fetchAllStoreLocations,
  });
};

// * ====================== Test EDI Connection ====================== *
const testEDIConnection = async (ediConnectionData: TestEDIConnectionInput) => {
  const { host, port, username, password, auth_type, file_location, file } = ediConnectionData;
  const url = import.meta.env.VITE_EDI_PING_URL;

  const res = await llamaApi.post(url, {
    host,
    port,
    username,
    password,
    auth_type,
    file_location,
    file,
  });

  const data = res.data;

  if (data.error) {
    throw new Error(data.error);
  }

  return { success: data?.message ? true : false };
};

export const useTestEDIConnection = () => {
  return useMutation({
    mutationFn: ({ ediConnectionData }: { ediConnectionData: TestEDIConnectionInput }) =>
      testEDIConnection(ediConnectionData),
  });
};
