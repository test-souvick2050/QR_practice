import supabase from '@/configs/supabse';
import useAuthStore from '@/store/authStore';

export const getStoreLocations = async () => {
  const userProfile = useAuthStore.getState().userProfile;
  const user_id = userProfile?.id;
  const role = userProfile?.role;

  if (!user_id || !role) return [];

  switch (role) {
    case 'superadmin': {
      const data = await superAdminStoreLocations();
      return data || [];
    }

    default:
      return [];
  }
};

console.log('role:', useAuthStore.getState().userProfile?.role);

const superAdminStoreLocations = async () => {
  const { data, error } = await supabase.from('store_locations').select('*').eq('status', 'active');

  if (error) throw error;
  return data;
};

// const getOwnerStoreLocation = async (user_id: string) => {
//   const { data, error } = await supabase
//     .from('store_owners')
//     .select(
//       `
//         id, user_id,
//         store_locations:store_locations(
//           id, name, status
//         )
//       `
//     )
//     .eq('user_id', user_id) // Adjust if your column is different
//     .maybeSingle();

//   if (error) throw error;
//   return data;
// };

// const getManagerStoreLocations = async (user_id: string) => {
//   const { data, error } = await supabase
//     .from('store_employees')
//     .select(
//       `
//         id, user_id,
//        store_location:store_locations(
//           id, name, status
//        )
//       `
//     )
//     .eq('user_id', user_id) // Adjust if your column is different
//     .maybeSingle();

//   if (error) throw error;
//   return data;
// };

// const getEmployeeStoreLocations = async (user_id: string) => {
//   const { data, error } = await supabase
//     .from('store_employees')
//     .select(
//       `
//         id, user_id,
//        store_location:store_locations(
//           id, name, status
//        )
//       `
//     )
//     .eq('user_id', user_id) // Adjust if your column is different
//     .maybeSingle();

//   if (error) throw error;
//   return data;
// };

// export const validStoreLocation = async (store_location_id: any) => {
//   let isValid = true;
//   const storeLocations: any = await getStoreLocations();
//   const findStoreLocation = storeLocations.find(
//     (location: any) => location.id === store_location_id
//   );

//   if (!findStoreLocation || findStoreLocation.status !== 'active') {
//     isValid = false;
//   }
//   return isValid;
// };

// export const validStoreLocation = async (store_location_id: any) => {
//   let isValid = true;
//   const storeLocations: any = await getStoreLocations();
//   const findStoreLocation = storeLocations.find(
//     (location: any) => String(location.id) === String(store_location_id)
//   );

//   if (!findStoreLocation || findStoreLocation.status !== 'active') {
//     isValid = false;
//   }
//   return isValid;
// };

export const validStoreLocation = async (store_location_id: any) => {
  const storeLocations: any = await getStoreLocations();

  console.log('storeLocations:', storeLocations); // ← add this
  console.log('storeLocations length:', storeLocations.length);

  // const findStoreLocation = storeLocations.find(
  //   (location: any) => String(location.id) === String(store_location_id)
  // );
  const findStoreLocation = storeLocations.find(
    (location: any) => Number(location.id) === Number(store_location_id)
  );
  console.log('findStoreLocation:', findStoreLocation); // found or undefined?

  if (!findStoreLocation || findStoreLocation.status !== 'active') {
    return false;
  }
  return true;
};
