"use client";

import { Card, CardBody, CardHeader, Form, Input, Button } from "@heroui/react";

import { useWallet } from "@/hooks/useWallet";

type LabelValuePairProps = {
  label: string;
  value: string;
};

const EXPLORER_URL = "https://testnet.xrpl.org/transactions/";

export default function Home() {
  const {
    wallet,
    destinationAddress,
    txHash,
    handleConnect,
    handleDisconnect,
    handleSend,
    handleGenerateAddress,
  } = useWallet();

  /**
   * ラベルと値のペアを表示するコンポーネント
   * @param label ラベル
   * @param value 値
   * @returns JSX.Element
   */
  const LabelValuePair = ({
    label,
    value,
  }: LabelValuePairProps): JSX.Element => {
    return (
      <>
        <p className="font-bold text-md">{label}</p>
        <p className="text-md">
          <span className="ml-4">{value}</span>
        </p>
      </>
    );
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Card className="w-full max-w-md mt-4 p-4">
        <CardHeader className="flex gap-3">
          <h2 className="text-lg font-bold">ウォレット情報</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-2">
            {wallet.isConnected && (
              <div className="flex flex-col gap-2 mb-4">
                <LabelValuePair label="自分のアドレス" value={wallet.address} />
                <LabelValuePair label="チェーン" value={wallet.chain} />
                <LabelValuePair label="ネットワーク" value={wallet.network} />
                <LabelValuePair label="残高" value={`${wallet.balance} XRP`} />
                {destinationAddress && (
                  <LabelValuePair
                    label="宛先のアドレス"
                    value={destinationAddress}
                  />
                )}
              </div>
            )}
            {!wallet.isConnected && (
              <Button
                className="w-full"
                color="primary"
                onPress={handleConnect}
              >
                接続
              </Button>
            )}
            {wallet.isConnected && !destinationAddress && (
              <Button
                className="w-full mb-2"
                color="primary"
                onPress={handleGenerateAddress}
              >
                宛先のウォレットを生成
              </Button>
            )}
            {wallet.isConnected && (
              <Button
                className="w-full"
                color="danger"
                onPress={handleDisconnect}
              >
                切断
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
      {wallet.isConnected && (
        <Card className="w-full max-w-md mt-4 p-4">
          <CardHeader className="flex gap-3">
            <h2 className="text-lg font-bold">送金フォーム</h2>
          </CardHeader>
          <CardBody>
            {txHash && (
              <div className="flex flex-col gap-2 mb-4">
                <p className="font-bold text-md">トランザクションハッシュ</p>
                <p className="text-sm">
                  <a
                    href={`${EXPLORER_URL}${txHash}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {`${EXPLORER_URL}${txHash}`}
                  </a>
                </p>
              </div>
            )}
            <Form onSubmit={handleSend}>
              <Input
                isRequired
                errorMessage="送金するアドレスを入力してください"
                label="アドレス"
                labelPlacement="outside"
                name="address"
                placeholder="送金するアドレスを入力してください"
                type="text"
              />
              <Input
                isRequired
                endContent={<span>XRP</span>}
                errorMessage="数量を入力してください"
                label="数量"
                labelPlacement="outside"
                name="amount"
                placeholder="送金する数量を入力してください"
                type="number"
              />
              <div className="flex justify-end mt-2">
                <Button color="primary" type="submit">
                  送金
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      )}
    </section>
  );
}
