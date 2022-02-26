import { ISCNQueryClient, ISCNSigningClient } from "@likecoin/iscn-js";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
  StargateClient,
} from "@cosmjs/stargate";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

(async () => {
  // Use mnemonic
  const mnemonic =
    "surround miss nominee dream gap cross assault thank captain prosper drop duty group candy wealth weather scale put";
  const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
  const [wallet] = await signer.getAccounts();

  /* For Keplr, use suggestChain API and config found in
    https://github.com/likecoin/mainnet/ or
    https://github.com/likecoin/testnets/ */

  // await window.keplr.experimentalSuggestChain(config);
  // await window.keplr.enable('likecoin-mainnet-2');
  // const signer = window.getOfflineSigner('likecoin-mainnet-2');
  // const [wallet] = await signer.getAccounts();

  const client = new ISCNQueryClient();
  const signingClient = new ISCNSigningClient();
  await signingClient.connectWithSigner(
    "https://mainnet-node.like.co/rpc/",
    signer
  );

  const ISCNPayload = {
    contentFingerprints: [
      "hash://sha256/9564b85669d5e96ac969dd0161b8475bbced9e5999c6ec598da718a3045d6f2e",
    ],
    stakeholders: [
      {
        entity: {
          "@id": "did:cosmos:5sy29r37gfxvxz21rh4r0ktpuc46pzjrmz29g45",
          name: "Chung Wu",
        },
        rewardProportion: 95,
        contributionType: "http://schema.org/author",
      },
    ],
    type: "Article",
    name: "使用矩陣計算遞歸關係式",
    usageInfo: "https://creativecommons.org/licenses/by/4.0",
    keywords: ["matrix", "recursion"],
  };

  const res = await signingClient.createISCNRecord(wallet.address, ISCNPayload);

  const iscnID = await client.queryISCNIdsByTx(res.transactionHash);

  // Or sign only mode

  const signedTxRaw = await signingClient.createISCNRecord(
    wallet.address,
    ISCNPayload,
    { broadcast: false }
  );
  const txBytes = TxRaw.encode(signedTxRaw).finish();
  const res2 = await signingClient
    .getSigningStargateClient()
    .broadcastTx(txBytes);
})();
