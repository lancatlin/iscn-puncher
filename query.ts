import { ISCNQueryClient } from '@likecoin/iscn-js';

const client = new ISCNQueryClient();

async function main() {
	const res = await client.queryRecordsById('iscn://likecoin-chain/dLbKMa8EVO9RF4UmoWKk2ocUq7IsxMcnQL1_Ps5Vg80/1');
	console.log(res);
}

main();
