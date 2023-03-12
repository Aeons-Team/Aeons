import { useState, useEffect } from "react";
import style from "./style.module.css";
import { useBundlrState } from "../../stores/BundlrStore";
import Button from "../Button"

export default function Encrypt() {
  let [encryptionPublicKey, setEncryptionPublicKey] = useState();
  let [address, setAddress] = useState();
  const [fileSystem, client] = useBundlrState((state) => [
    state.fileSystem,
    state.client
  ]);

  async function findAddress() {
    const add  = await client.getAddress();
    setAddress(add);
  };

  findAddress();

  useEffect(() => {
    if(address){
    ethereum
    .request({
        method: 'eth_getEncryptionPublicKey',
        params: [address], 
    })
    .then((result) => {
        setEncryptionPublicKey(result);
    })
    }
  }, [address]);

  async function createUser() {
    if(encryptionPublicKey){
    const tx = await fileSystem.userInit(encryptionPublicKey);
    console.log(tx);
  }
  };

  return (
    <div className={style.wallet}>
      
      <Button
        onClick={() => {
          createUser()
        }}
      >
        Init user
      </Button>
    </div>
  );
}