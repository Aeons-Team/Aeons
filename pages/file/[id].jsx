import { useRouter } from "next/router";
import { useEffect } from "react";
import Crypto from "../../lib/Crypto";

function File() {
	const router = useRouter();
	
	useEffect(() => {
		if(!router.isReady) return;

		let {id, key, iv, contentType } = router.query
		key = Buffer.from(key, 'hex')
		iv = Buffer.from(iv, 'hex')

		async function load() {

			const cryptoKey = await Crypto.aesImportKey(key)
			const buffer = await fetch(`${process.env.NEXT_PUBLIC_ARWEAVE_URL}/${id}`).then(res => res.arrayBuffer())
			const decrypted = await Crypto.aesDecrypt(buffer, cryptoKey, iv)
			const blob = new Blob([decrypted], {type: contentType})
			const url = URL.createObjectURL(blob)
		  window.location.href = url
		}

		load()
	}, [router.isReady])

}

export default File;
