import { ethers } from 'ethers';

export const getSigner = async (provider: any) => {
  if (!provider) throw new Error('Provider not available');
  return await provider.getSigner();
};

export const getBalance = async (provider: any, address: string) => {
  if (!provider) throw new Error('Provider not available');
  return await provider.getBalance(address);
};