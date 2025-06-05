import { useState } from "react";
import { Client, Wallet as XRPWallet, xrpToDrops } from "xrpl";

import { getAddress, getNetwork, sendPayment } from "@/libs/gemWallet";

// 定数
const XRPL_TESTNET_URL = "wss://s.altnet.rippletest.net:51233";

// 型定義
export type Wallet = {
  isConnected: boolean;
  address: string;
  chain: string;
  network: string;
  balance: number;
};

export const initialWallet: Wallet = {
  isConnected: false,
  address: "",
  chain: "",
  network: "",
  balance: 0,
};

/**
 * XRPLウォレット管理用カスタムフック
 * @returns {Object} ウォレット状態・各種操作関数・状態管理用フラグ
 * @example
 * const {
 *   wallet,
 *   destinationAddress,
 *   txHash,
 *   isLoading,
 *   error,
 *   handleConnect,
 *   handleDisconnect,
 *   handleSend,
 *   handleGenerateAddress,
 * } = useWallet();

 */
export function useWallet() {
  const [wallet, setWallet] = useState<Wallet>(initialWallet);
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ウォレット接続
   * @returns {Promise<void>}
   * @throws 接続や取得に失敗した場合はエラーをセット
   */
  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const address = await getAddress();
      const { chain, network } = await getNetwork();
      const client = new Client(XRPL_TESTNET_URL);

      await client.connect();
      const balance = await client.getXrpBalance(address);

      await client.disconnect();

      setWallet({
        isConnected: true,
        address,
        chain,
        network,
        balance,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "ウォレット接続に失敗しました";

      setError(msg);
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ウォレット切断
   * @returns {void}
   */
  const handleDisconnect = () => {
    setWallet(initialWallet);
    setDestinationAddress("");
    setTxHash("");
    setError(null);
  };

  /**
   * 送金処理
   * @param e - フォームイベント
   * @returns {Promise<void>}
   * @throws 送金に失敗した場合はエラーをセット
   */
  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const address = formData.get("address") as string;
      const amount = formData.get("amount") as string;

      if (!address || !amount) throw new Error("送金先アドレスと金額は必須です");

      const amountInDrops = xrpToDrops(Number(amount)).toString();
      const result = await sendPayment(address, amountInDrops);

      if (!result) throw new Error("送金に失敗しました");

      setTxHash(result.hash);
      setDestinationAddress("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "送金に失敗しました";

      setError(msg);
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 新規アドレス生成
   * @returns {void}
   * @throws アドレス生成に失敗した場合はエラーをセット
   */
  const handleGenerateAddress = () => {
    setError(null);
    try {
      const result = XRPWallet.generate();

      setDestinationAddress(result.classicAddress);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "アドレス生成に失敗しました";

      setError(msg);
      alert(msg);
    }
  };

  return {
    wallet,
    destinationAddress,
    txHash,
    isLoading,
    error,
    handleConnect,
    handleDisconnect,
    handleSend,
    handleGenerateAddress,
  };
}
