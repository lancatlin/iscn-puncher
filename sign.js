import dotenv from 'dotenv';
dotenv.config();

import { ISCNQueryClient, ISCNSigningClient } from '@likecoin/iscn-js';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningStargateClient, StargateClient } from '@cosmjs/stargate';

const MNEMONIC = process.env['MNEMONIC'];
console.log(MNEMONIC);

async function sign() {
	const signer = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC);
	const [wallet] = await signer.getAccounts();
	console.log(wallet);

	const signingClient = new ISCNSigningClient();
	await signingClient.connectWithSigner('http://node.testnet.like.co/rpc/', wallet);
	const client = new ISCNQueryClient();
	await client.connect('http://node.testnet.like.co/rpc/');

	const res = await signingClient.createISCNRecord(wallet.address, {
		'contentFingerPrints': [
			"hash://sha256/9564b85669d5e96ac969dd0161b8475bbced9e5999c6ec598da718a3045d6f2e",
		],
		'stakeholders': [
			{
				'entity': {
					'@id': wallet.address,
					'name': 'Justin Lin',
				},
				'rewardProportion': 100,
				'contributionType': "http://schema.org/author",
			}
		],
		'type': 'Message',
		'name': 'Test ISCN',
	})
	console.log(res);
	const iscnID = await client.queryISCNIdsByTx(res.transactionHash);
	console.log(iscnID)
}

sign();