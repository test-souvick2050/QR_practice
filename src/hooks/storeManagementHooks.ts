import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { timeConverter } from '@/utils/time';
import supabase from '@/configs/supabse';
// import type { number } from 'yup';
import useAuthStore from '@/store/authStore';

interface CreateStoreInput {
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  subdomain: string;
  store_owner_id: string;
  address: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  lat: string;
  lng: string;
  state_code: string;
  country_code: string;
}

interface UpdateStoreInput {
  storeId: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  subdomain: string;
  store_owner_id: string;
  address: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  lat: string;
  lng: string;
  state_code: string;
  country_code: string;
}

// FETCH ALL STORE.
const fetchAllStores = async () => {
  const { data, error } = await supabase
    .from('store_locations')
    .select(
      `
       *,
        store_owners (
          id, user_id,
          users (
            id, name
          )
        )
      `
    )
    .order('created_at', { ascending: false });

  const result = data?.map((row) => {
    const { store_owners, ...storeData } = row;

    const store_owner = store_owners as any;

    return {
      ...storeData,
      store_owner: {
        id: store_owner?.id,
        user_id: store_owner?.user_id,
        name: store_owner?.users.name,
      },
    };
  });

  if (error) throw error;
  return result;
};

export const useFetchAllStores = () => {
  return useQuery({
    queryKey: ['stores'],
    queryFn: fetchAllStores,
    staleTime: timeConverter(20, 'minute'),
  });
};

// FETCH SINGLE STORE
const fetchSingleStore = async (storeId: string) => {
  const { data, error } = await supabase
    .from('store_locations')
    .select(
      `
  *,
  store_owners (
    id, user_id,
    users (id, name)
  )
`
    )
    .eq('id', storeId)
    .maybeSingle();

  const { store_owners, ...storeData } = data as any;

  const result = {
    ...storeData,
    store_owner: {
      id: store_owners?.id,
      user_id: store_owners?.user_id,
      name: store_owners?.users.name,
    },
  };

  if (error) throw error;
  return result as any;
};

export const useFetchSingleStore = (storeId?: string) => {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: () => fetchSingleStore(storeId!),
    enabled: !!storeId,
    staleTime: timeConverter(10, 'minute'),
  });
};

//CREATE STORE.
export const createStore = async (storeData: CreateStoreInput) => {
  // const userProfile = useAuthStore.getState().userProfile;
  const {
    name,
    email,
    phone,
    status,
    subdomain,
    store_owner_id,
    address,
    street,
    city,
    state,
    country,
    zip,
    lat,
    lng,
    state_code,
    country_code,
  } = storeData;

  const { data: existingStores, error: fetchError } = await supabase
    .from('store_locations')
    .select('id')
    .or(`email.eq.${email},phone.eq.${phone}`);

  if (fetchError) {
    throw fetchError;
  }

  if (existingStores && existingStores.length > 0) {
    throw new Error('Store with the same email or phone number already exists');
  }

  const { error: dbError, data: insertedStoreData } = await supabase
    .from('store_locations')
    .insert({
      store_owner_id,
      name,
      email,
      phone,
      status,
      subdomain,
      address,
      street,
      city,
      state,
      country,
      zip,
      lat,
      lng,
      state_code,
      country_code,
      // created_by_user_id: userProfile?.id,
      // updated_by_user_id: userProfile?.id,
    })
    .select();

  if (dbError || !insertedStoreData?.length) {
    throw dbError || new Error('Failed to insert Store');
  }

  const insertedStoreId = insertedStoreData[0]?.id;

  // console.log('insertedStoreId', insertedStoreId);

  return { success: true, storeId: insertedStoreId };
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['unassigned-store-owners'], exact: false });
    },
  });
};

// DELETE STORE.
export const deleteStore = async (id: string | number) => {
  const { data, error } = await supabase.from('store_locations').delete().eq('id', id);

  if (error) {
    console.log('error', error);
    throw error;
  }

  return data;
};
export const useDeleteStore = () => {
  const queryClient = useQueryClient();
  // console.log('queryClient', queryClient);

  return useMutation({
    mutationFn: deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      // queryClient.invalidateQueries({ queryKey: ['unassigned-store-owners'] });
    },
  });
};

// UPDATE STORE.
export const updateStore = async (updateStoreInput: UpdateStoreInput) => {
  const {
    storeId,
    name,
    email,
    phone,
    status,
    subdomain,
    store_owner_id,
    address,
    street,
    city,
    state,
    country,
    zip,
    lat,
    lng,
    state_code,
    country_code,
  } = updateStoreInput;

  // Getting store owner data
  if (!store_owner_id) throw new Error('Store owner not found');
  const { data: storeOwnerData, error: storeOwnerError } = await supabase
    .from('store_owners')
    .select('user_id')
    .eq('id', store_owner_id)
    .maybeSingle();

  if (!storeOwnerData) throw new Error('Store owner not found');
  if (storeOwnerError) throw storeOwnerError;

  const store_owner_user_id = storeOwnerData?.user_id;
  if (!store_owner_user_id) throw new Error('Store owner user not found');

  if (!storeId) throw new Error('Store cannot be fetched');

  // Check for duplicate email/phone (excluding current store)
  const { data: existingStores, error: checkError } = await supabase
    .from('store_locations')
    .select('id')
    .or(`email.eq.${email},phone.eq.${phone}`)
    .neq('id', storeId);

  if (checkError) throw checkError;
  if (existingStores?.length) {
    throw new Error('Store with this email or phone number already exists');
  }

  // Update store basic fields
  const { error: dbError } = await supabase
    .from('store_locations')
    .update({
      store_owner_id,
      name,
      email,
      phone,
      status,
      subdomain,
      address,
      street,
      city,
      state,
      country,
      zip,
      lat,
      lng,
      state_code,
      country_code,
    })
    .eq('id', storeId);

  if (dbError) throw dbError;

  return { success: true };
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['store'], exact: false });
      queryClient.invalidateQueries({
        queryKey: ['unassigned-store-owners'],
        exact: false,
      });
    },
  });
};

// // * ====================== Fetch Store Owners for Create/Edit ====================== *
export const fetchActiveStoreOwners = async () => {
  const { data: unassignedOwners, error: unassignedOwnersErr } = await supabase
    .from('store_owners')
    .select(
      `
        *,
        user:users (
          id, name, status
        )
      `
    )
    .not('user', 'is', null)
    .eq('user.status', 'active');

  if (unassignedOwnersErr) throw unassignedOwnersErr;

  const result = unassignedOwners?.map((row) => {
    const userData = row.user;
    return {
      store_owner_id: row.id,
      user_id: userData?.id,
      name: userData?.name,
      status: userData?.status,
    };
  });

  return result;
};

export const useActiveStoreOwners = () => {
  return useQuery({
    queryKey: ['active-store-owners'],
    queryFn: fetchActiveStoreOwners,
  });
};
