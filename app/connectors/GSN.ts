import { MetaMaskConnector } from "@wagmi/connectors/metaMask";
import type { MetaMaskConnectorOptions } from "@wagmi/connectors/metaMask";
import { Chain } from "wagmi";
import { RelayProvider, wrapSigner } from "@opengsn/provider";
import contracts from '../constants/addresses.json'
import { JsonRpcProvider } from "@ethersproject/providers";

interface GSNConnectorOptions {
    chains?: Chain[];
    options?: MetaMaskConnectorOptions;
  }
  
export class GSNConnector extends MetaMaskConnector {
  constructor(options: GSNConnectorOptions) {
    super(options);
  }


  async getSigner():Promise<any> {
    const currentSigner = await super.getSigner()
    const wSigner = await wrapSigner(currentSigner,{
          paymasterAddress: contracts.localhost.paymaster,
          loggerConfiguration: {
            logLevel: 'debug',
          },
        })

    return wSigner;
  }
  
}
