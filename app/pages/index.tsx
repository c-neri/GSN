import styles from '@/styles/Home.module.css'
import { Button, Input } from '@geist-ui/core'
import { RelayProvider, wrapContract } from '@opengsn/provider'
import { BigNumber, ethers, providers } from 'ethers'
import { useState } from 'react'
import {
    useAccount,
    useConnect,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    usePrepareSendTransaction,
    useProvider,
    useSendTransaction,
    useSigner
  } from 'wagmi'
import {abi} from '../constants/abi.js'
import {abiRelay} from '../constants/abiRelay'
import contracts from '../constants/addresses.json'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const [value,setValue] = useState('0')


  const fundMe = async () => {
    try {
      if(!isConnected) return
      // Check if MetaMask is installed and connected
      if (typeof window.ethereum === 'undefined') {
        console.error('MetaMask is not installed.');
        return;
      }
  
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as unknown as providers.ExternalProvider
      );
      const signer = provider.getSigner();
      await window.ethereum.request({ method: 'eth_requestAccounts' });
  
      // Check if the signer's balance is sufficient
      const signerBalance = await signer.getBalance();
      const requiredBalance = ethers.utils.parseEther(value);
  
      if (signerBalance.lt(requiredBalance)) {
        console.error('Insufficient balance for the signer to cover the transaction.');
        return;
      }
  
      // Connect to the RelayHub contract
      const relayHubContract = new ethers.Contract(contracts.localhost.relayHub, abiRelay, signer);
  
      // Deposit funds
      const tx = await relayHubContract.depositFor(contracts.localhost.paymaster, {
        value: requiredBalance,
      });
  
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log('Transaction successful, receipt:', receipt);
    } catch (error:any) {
      console.error('An error occurred:', error.message);
    }
  };

  const { config, } = usePrepareContractWrite({
    address: contracts.localhost.contract as any,
    abi: abi,
    functionName: 'addValue',
    enabled: !!isConnected
  })
  const { writeAsync } = useContractWrite(config)

  const { data, isError, isLoading } = useContractRead({
    address: contracts.localhost.contract as any,
    abi: abi as any,
    functionName: 'value',
    enabled: !!isConnected
  })
  
  const { data:relayHub } = useContractRead({
    address: contracts.localhost.relayHub as any,
    abi: abiRelay as any,
    functionName: 'balanceOf',
    args:[contracts.localhost.paymaster],
    enabled: !!isConnected
  })

  return (
      <main className={styles.main}>
        <div>
          <div className='flex flex-col gap-1'>
            <div>
              value: {data && data.toString()}
            </div>
            <div>
              Bag: {relayHub && ethers.utils.formatEther(relayHub as any)}
            </div>
          </div>
          <div>
              {connectors.map((connector) => {
                return (
                    <Button
                        key={connector.id}
                        shadow
                        type="secondary"
                        className='mb-8'
                        onClick={() => !isConnected && connect({ connector })}
                    >
                        {address ? `${address.substring(0, 4 + 2)}...${address.substring(42 - 4)}` : "Connect"}
                    </Button>
                )
            })}
          </div>
        </div>
          <Input placeholder='enter amount to fund'onChange={(e:any) => setValue(e.target.value)}/>
           <Button shadow type="secondary" onClick={async() => await fundMe?.() }>FundMe</Button>
          <Button shadow type="secondary" onClick={async() => await writeAsync?.() }>Execute</Button>
      </main>
  )
}
