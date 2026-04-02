import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timeConverter } from '@/utils/time';
import supabase from '@/configs/supabse';
// import useAuthStore from '@/store/authStore';
// import logger from '@/utils/logger';
// import llamaApi from '@/configs/llamaApi';

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

type UpdateManufacturerPayload = {
  manufacturerId: string;
  manufacturerData: UpdateManufacturerInput;
  sftp_ssh_key_file: File | null;
};

// FETCH ALL MANUFACTURE.
const fetchAllManufacturers = async () => {
  const { data, error } = await supabase
    .from('manufacturers')
    .select(
      `
      *,
    store_location:store_locations(id, name)
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

// FETCH SINGLE MANUFACTURE
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

//CREATE MANUFACTURE NEW
const createManufacturer = async (manufacturerData: CreateManufacturerInput) => {
  const {
    connection_type,
    name,
    sftp_host,
    sftp_port,
    sftp_location,
    sftp_username,
    sftp_auth_type,
    sftp_password,
    store_location_id,
  } = manufacturerData;

  // let passwordToInsert = sftp_password;
  // if (sftp_auth_type === 'password') {
  //   const { encryptedPassword } = await encryptPassword(sftp_password);
  //   passwordToInsert = encryptedPassword;
  // }

  const { data, error } = await supabase.from('manufacturers').insert({
    connection_type,
    name,
    sftp_host,
    sftp_port,
    sftp_location,
    sftp_username,
    sftp_auth_type,
    sftp_password,
    store_location_id: store_location_id || null,
  });

  if (error) throw error;
  return { success: true, data };
};

export const useCreateManufacturer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (manufacturerData: CreateManufacturerInput) => createManufacturer(manufacturerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturers'], exact: false });
    },
  });
};

//DELETE MANUFACTURE.
export const deleteManufacturer = async (manufacturerId: string) => {
  if (!manufacturerId) throw new Error('Manufacturer cannot be fetched');
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

// ENCRYPT PASSWORD.
// const encryptPassword = async (plainPassword: string) => {
//   const { data, error } = await supabase.functions.invoke('encrypt-password', {
//     body: { plain: plainPassword },
//   });

//   if (error) throw error;
//   return data as { encryptedPassword: string; iv: string };
// };

// UPDATE MANUFACTURE NEW 2
const updateManufacturer = async (
  manufacturerId: string,
  manufacturerData: UpdateManufacturerInput
) => {
  const {
    connection_type,
    name,
    sftp_host,
    sftp_port,
    sftp_location,
    sftp_username,
    sftp_auth_type,
    sftp_password,
    store_location_id,
  } = manufacturerData;

  // let passwordToInsert = sftp_password;
  // if (sftp_auth_type === 'password') {
  //   const { encryptedPassword } = await encryptPassword(sftp_password);
  //   passwordToInsert = encryptedPassword;
  // }

  const { data, error } = await supabase
    .from('manufacturers')
    .update({
      connection_type,
      name,
      sftp_host,
      sftp_port,
      sftp_location,
      sftp_username,
      sftp_auth_type,
      sftp_password,
      store_location_id: store_location_id || null,
    })
    .eq('id', manufacturerId);

  if (error) throw error;

  return { success: true, data };
};

export const useUpdateManufacturer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateManufacturerPayload) =>
      updateManufacturer(payload.manufacturerId, payload.manufacturerData),

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
