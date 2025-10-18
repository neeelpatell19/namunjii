import { useHomeData as useHomeDataContext } from "../Components/StoreLogic/Context/HomeDataContext";

export const useHomeData = () => {
  return useHomeDataContext();
};

export default useHomeData;
