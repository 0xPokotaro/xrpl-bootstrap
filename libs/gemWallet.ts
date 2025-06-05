import {
  isInstalled as isInstalledApi,
  getAddress as getAddressApi,
  getNetwork as getNetworkApi,
  sendPayment as sendPaymentApi,
  type SendPaymentRequest,
} from "@gemwallet/api";

export const getAddress = async (): Promise<string> => {
  try {
    const { result: isGemWalletInstalled } = await isInstalledApi();

    if (!isGemWalletInstalled) {
      throw new Error("GemWallet is not installed");
    }

    const { result } = await getAddressApi();

    if (!result) {
      throw new Error("User rejected the request");
    }

    return result.address;
  } catch (error) {
    throw error;
  }
};

export const getNetwork = async (): Promise<{
  chain: string;
  network: string;
}> => {
  try {
    const { result: isGemWalletInstalled } = await isInstalledApi();

    if (!isGemWalletInstalled) {
      throw new Error("GemWallet is not installed");
    }

    const { result } = await getNetworkApi();

    if (!result) {
      throw new Error("User rejected the request");
    }

    return {
      chain: result.chain,
      network: result.network,
    };
  } catch (error) {
    throw error;
  }
};

export const sendPayment = async (destination: string, amount: string) => {
  try {
    const { result: isGemWalletInstalled } = await isInstalledApi();

    if (!isGemWalletInstalled) {
      throw new Error("GemWallet is not installed");
    }

    const payload: SendPaymentRequest = {
      amount,
      destination,
    };

    console.log("payload", payload);

    const { result } = await sendPaymentApi(payload);

    if (!result) {
      throw new Error("User rejected the request");
    }

    return result;
  } catch (error) {
    throw error;
  }
};
