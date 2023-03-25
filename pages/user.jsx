import { useEffect } from 'react'
import { ethers } from 'ethers'
import UserContract from '../lib/UserContract'

function UserPage() {
    useEffect(() => {
        async function init() {
            await window.ethereum.request({ method: "eth_requestAccounts" });
          
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new UserContract(provider)
    
            // await contract.create()

            contract.setContractId('sxlwGvlRz1Ul5m8al3ki0PT9FaqmHhsrGDXFZYAkvJo')
            await contract.initialize()

            await contract.instance.writeInteraction({
                function: {
                    Insert: {
                        id: 'id1',
                        name: 'file1',
                        contentType: 'folder'
                    }
                }
            })

            const state = (await contract.instance.readState()).cachedValue.state
            
            console.log(state)
        }

        init()
    }, [])

    return (
        <div>
            xd
        </div>
    )
}

export default UserPage