//这里是发送币所需的方法，调用的各种api
import axios from 'axios';
import init, { ChainParams, P2PKHAddress, PrivateKey, Transaction, TxOut } from 'bsv-wasm-web';
import { TaggedDerivationResponse } from '../pages/requests/GenerateTaggedKeysRequest';
import { GP_BASE_URL, GP_TESTNET_BASE_URL, JUNGLE_BUS_URL } from '../utils/constants';
import { decryptUsingPrivKey } from '../utils/crypto';
import { chunkedStringArray } from '../utils/format';
import { DerivationTag, getTaggedDerivationKeys, Keys } from '../utils/keys';
import { NetWork } from '../utils/network';
import { isBSV20v2 } from '../utils/ordi';
import { storage } from '../utils/storage';
import { getCurrentUtcTimestamp } from '../utils/tools';
import { BSV20Txo, OrdinalResponse, OrdinalTxo } from './ordTypes';
import { StoredUtxo } from './useBsv';
import { useNetwork } from './useNetwork';
import { BSV20 } from './useOrds';

type GorillaPoolErrorMessage = {
  message: string;
};

export type GorillaPoolBroadcastResponse = {
  txid?: string;
  message?: string;
};

export type Token = {
  txid: string;
  vout: number;
  height: number;
  idx: number;
  tick: string;
  id: string;
  sym: string;
  icon: string;
  max: string;
  lim: string;
  dec: number;
  amt: string;
  supply: string;
  status: number;
  available: string;
  pctMinted: number;
  accounts: number;
  pending: number;
  included: boolean;
  fundAddress: string;
  fundTotal: number;
  fundUsed: number;
  fundBalance: number;
};

export type MarketResponse = {
  txid: string;
  vout: number;
  outpoint: string;
  owner: string;
  script: string;
  spend: string;
  spendHeight: number;
  spendIdx: number;
  height: number;
  idx: number;
  op: string;
  tick: string;
  id: string;
  sym: string;
  dec: number;
  icon: string;
  amt: string;
  status: number;
  reason: string;
  listing: boolean;
  price: number;
  pricePer: number;
  payout: string;
  sale: boolean;
};

export const useGorillaPool = () => {
  const { network, isAddressOnRightNetwork } = useNetwork();

  const getOrdinalsBaseUrl = () => {//这里是编码后的交易数据发送到GorillaPool提供的API端点
    return network === NetWork.Mainnet ? GP_BASE_URL : GP_TESTNET_BASE_URL;
  };

  const getChainParams = (network: NetWork): ChainParams => {
    return network === NetWork.Mainnet ? ChainParams.mainnet() : ChainParams.testnet();
  };
//用来获取一个地址的未花费交易输出（unspent transaction outputs, UTXOs）列表。该函数接受一个 ordAddress 参数（表示需要查询UTXOs的地址），
//并且返回一个名为 OrdinalResponse 类型的 Promise 对象
  const getOrdUtxos = async (ordAddress: string): Promise<OrdinalResponse> => {
    try {
      if (!isAddressOnRightNetwork(ordAddress)) return [];
      const { data } = await axios.get<OrdinalTxo[]>(
        `${getOrdinalsBaseUrl()}/api/txos/address/${ordAddress}/unspent?limit=1500&offset=0`,
      );
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
//这里是广播到链上的函数 
// 这段代码定义了一个名为 broadcastWithGorillaPool 的异步函数，作用是将一个已签名的比特币交易的十六进制字符串 txhex 通过GorillaPool的API发送到比特币网络中。以下是该函数执行的逻辑：
// 首先，函数尝试执行一个操作，而这个操作可能抛出异常（错误），所以它被包裹在一个 try 代码块中，允许错误被 catch 代码块捕获。
// 函数将交易的十六进制字符串 txhex 转换成 base64 编码。这通常是因为API接口可能要求以 base64 格式提交数据而不是原始的十六进制。
// 然后，使用 axios.post 方法，函数通过HTTP POST请求将编码后的交易数据发送到GorillaPool提供的API端点。API的URL通过调用 getOrdinalsBaseUrl() 获取，该函数看起来会返回API的基本URL。发送的数据包括一个对象，它有一个 rawtx 键，其值为编码后的交易数据。
// 发送请求后，函数等待响应。如果 res.status 等于200且 res.data 的类型为字符串，则认为交易成功广播并且返回的是交易ID（txid）。这时，函数还会调用 updateStoredPaymentUtxos 函数来更新本地存储的UTXO信息（可能是为了标记已使用的UTXO）。
// 如果响应的状态不是200或返回的数据类型不是字符串（即出现错误或异常），函数则认为广播交易操作失败，并将错误消息作为 GorillaPoolErrorMessage 类型返回。
// 如果在请求过程中抛出异常，catch 代码块将捕获它。这里的 error 对象包含了异常信息。函数记录错误详情到控制台，并返回一个包含错误信息的对象，这个信息是从 error.response.data 中提取的（如果存在的话），否则返回默认的错误消息 'Unknown error while broadcasting tx'。
// 通过这个过程，broadcastWithGorillaPool 函数实现了将已签名的交易广播到比特币网络中的功能，并且处理了可能的异常情况，向调用者提供了明确的广播结果或错误消息。
  const broadcastWithGorillaPool = async (txhex: string): Promise<GorillaPoolBroadcastResponse> => {
    try {
      // console.log(txhex);
      const encoded = Buffer.from(txhex, 'hex').toString('base64');
      // const res = await axios.post<string | GorillaPoolErrorMessage>(`${getOrdinalsBaseUrl()}/api/tx`, {//这里是send最重要的api
      const res = await axios.post<string | GorillaPoolErrorMessage>(`http://192.168.50.61:5000/v1/bsv/main/tx/raw/`, {//这里是tbc的上链api
        // rawtx: encoded,
        "txHex": txhex,
      });
      if (res.status === 200 && typeof res.data === 'string') {
        if (await updateStoredPaymentUtxos(txhex)) {
          console.log("success");
        } else {
          console.log("fail");
        }
        // await updateStoredPaymentUtxos(txhex);执行了两次存在错误
        return { txid: res.data };
      } else {
        return res.data as GorillaPoolErrorMessage;
      }
    } catch (error: any) {
      console.log(error);
      return { message: JSON.stringify(error.response.data ?? 'Unknown error while broadcasting tx') };
    }
  };

  const submitTx = async (txid: string) => {//其目的是通过网络接口提交一个交易ID（txid），并检查提交的状态
    try {
      let res = await axios.post(`${getOrdinalsBaseUrl()}/api/tx/${txid}/submit`);

      if (res.status !== 0) {
        console.error('submitTx failed: ', txid);
      }
    } catch (error) {
      console.error('submitTx failed: ', txid, error);
    }
  };

  const getUtxoByOutpoint = async (outpoint: string): Promise<OrdinalTxo> => {//是通过网络请求获取特定的未花费交易输出（UTXO）的数据
    try {
      const { data } = await axios.get(`${getOrdinalsBaseUrl()}/api/txos/${outpoint}?script=true`);
      const ordUtxo: OrdinalTxo = data;
      if (!ordUtxo.script) throw Error('No script when fetching by outpoint');
      ordUtxo.script = Buffer.from(ordUtxo.script, 'base64').toString('hex');
      return ordUtxo;
    } catch (e) {
      throw new Error(JSON.stringify(e));
    }
  };

  const getMarketData = async (outpoint: string) => {//目的是从一个API端点获取与某个特定点相关的市场数据。
    try {
      const res = await axios.get(`${getOrdinalsBaseUrl()}/api/inscriptions/${outpoint}?script=true`);
      const data = res.data as OrdinalTxo;
      if (!data?.script || !data.origin?.outpoint.toString()) throw new Error('Could not get listing script');
      return { script: data.script, origin: data.origin.outpoint.toString() };
    } catch (error) {
      throw new Error(`Error getting market data: ${JSON.stringify(error)}`);
    }
  };

  const getBsv20Balances = async (ordAddress: string) => {
    if (!isAddressOnRightNetwork(ordAddress)) return [];
    const res = await axios.get(`${getOrdinalsBaseUrl()}/api/bsv20/${ordAddress}/balance`);

    const bsv20List: Array<BSV20> = res.data.map(//主要功能是获取一个给定比特币SV地址（ordAddress）在一个或多个BSV20资产中的余额。
      (b: {
        all: {
          confirmed: string;
          pending: string;
        };
        listed: {
          confirmed: string;
          pending: string;
        };
        tick?: string;
        sym?: string;
        id?: string;
        icon?: string;
        dec: number;
      }) => {
        const id = (b.tick || b.id) as string;
        return {
          id: id,
          tick: b.tick,
          sym: b.sym || null,
          icon: b.icon || null,
          dec: b.dec,
          all: {
            confirmed: BigInt(b.all.confirmed),
            pending: BigInt(b.all.pending),
          },
          listed: {
            confirmed: BigInt(b.all.confirmed),
            pending: BigInt(b.all.pending),
          },
        };
      },
    );

    return bsv20List;
  };

  const getBSV20Utxos = async (tick: string, address: string): Promise<BSV20Txo[] | undefined> => {//用来对特定的加密货币地址和代币标识符进行查询，以便获取与之关联的UTXO（Unspent Transaction Outputs，未花费交易输出）数组。
    try {
      if (!address) {
        return [];
      }

      const url = isBSV20v2(tick)
        ? `${getOrdinalsBaseUrl()}/api/bsv20/${address}/id/${tick}`
        : `${getOrdinalsBaseUrl()}/api/bsv20/${address}/tick/${tick}`;

      const r = await axios.get(url);

      if (!Array.isArray(r.data)) {
        return [];
      }

      return (r.data as BSV20Txo[]).filter((utxo) => utxo.status === 1 && !utxo.listing);
    } catch (error) {
      console.error('getBSV20Utxos', error);
      return [];
    }
  };

  const getBsv20Details = async (tick: string) => {//根据传入的代币标识符（tick）异步获取BSV20代币的详细信息
    try {
      const url = isBSV20v2(tick)
        ? `${getOrdinalsBaseUrl()}/api/bsv20/id/${tick}`
        : `${getOrdinalsBaseUrl()}/api/bsv20/tick/${tick}`;

      const r = await axios.get<Token>(url);

      return r.data;
    } catch (error) {
      console.error('getBsv20Details', error);
    }
  };

  const getLockedUtxos = async (address: string) => {//此函数异步获取指定地址的锁定的UTXOs（未花费的交易输出）。它首先检查地址是否在正确的网络上，然后发送一个GET请求到指定的API端点，获取该地址的锁定UTXO列表。
    try {
      if (!isAddressOnRightNetwork(address)) return [];
      //TODO: use this instead of test endpoint - `${getOrdinalsBaseUrl()}/api/locks/address/${address}/unspent?limit=100&offset=0`
      const { data } = await axios.get(
        `${getOrdinalsBaseUrl()}/api/locks/address/${address}/unspent?limit=100&offset=0`,
      );
      const lockedUtxos: OrdinalTxo[] = data;
      return lockedUtxos;
    } catch (e) {
      throw new Error(JSON.stringify(e));
    }
  };

  const getSpentTxids = async (outpoints: string[]): Promise<Map<string, string>> => {//异步获取一组UTXOs是否已花费的信息，并返回一个包含UTXOs和其对应花费交易ID的映射对象。函数将输入的UTXOs数组按块分割，并对每一块进行查询
    try {
      const chunks = chunkedStringArray(outpoints, 50);
      let spentTxids = new Map<string, string>();
      for (const chunk of chunks) {
        try {
          //TODO: updata url to be dynamic for testnet
          const res = await axios.post(`${getOrdinalsBaseUrl()}/api/spends`, chunk);
          const txids = res.data as string[];
          txids.forEach((txid, i) => {
            spentTxids.set(chunk[i], txid);
          });
        } catch (error) {}
      }
      return spentTxids;
    } catch (error) {
      console.log(error);
      return new Map();
    }
  };

  const getOrdContentByOriginOutpoint = async (originOutpoint: string) => {//此函数异步获取一个outpoint（交易输出点）所指向的ordinal内容。向相应的API端点发送GET请求，并以数组形式接收二进制响应数据，然后将其转换为Buffer。
    try {
      const res = await axios.get(`${getOrdinalsBaseUrl()}/content/${originOutpoint}?fuzzy=false`, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const setDerivationTags = async (identityAddress: string, keys: Keys) => {//此函数异步为一系列的ordinals设置衍生标签。它检索与给定地址相关联的UTXOs，解密获得的内容，并从中提取衍生标签和地址，最后存储这些信息。
    const taggedOrds = await getOrdUtxos(identityAddress);
    let tags: TaggedDerivationResponse[] = [];
    for (const ord of taggedOrds) {
      try {
        if (!ord.origin?.outpoint || ord.origin.data?.insc?.file.type !== 'panda/tag') continue;
        const contentBuffer = await getOrdContentByOriginOutpoint(ord.origin.outpoint.toString());
        if (!contentBuffer || contentBuffer.length === 0) continue;

        const derivationTag = decryptUsingPrivKey(
          [Buffer.from(contentBuffer).toString('base64')],
          PrivateKey.from_wif(keys.identityWif),
        );

        const parsedTag: DerivationTag = JSON.parse(Buffer.from(derivationTag[0], 'base64').toString('utf8'));
        const taggedKeys = getTaggedDerivationKeys(parsedTag, keys.mnemonic);

        const taggedAddress = P2PKHAddress.from_string(taggedKeys.address)
          .set_chain_params(getChainParams(network))
          .to_string();

        tags.push({ tag: parsedTag, address: taggedAddress, pubKey: taggedKeys.pubKey.to_hex() });
      } catch (error) {
        console.log(error);
      }
    }

    storage.set({ derivationTags: tags });
  };

  const getTxOut = async (txid: string, vout: number) => {//此函数异步获取一个交易的输出部分（特定的txid和vout），并返回一个TxOut对象。它发送GET请求获取交易输出数据，并将返回的数组形式二进制数据转换为TxOut。
    try {
      await init();
      const { data } = await axios.get(`${JUNGLE_BUS_URL}/v1/txo/get/${txid}_${vout}`, { responseType: 'arraybuffer' });
      return TxOut.from_hex(Buffer.from(data).toString('hex'));
    } catch (error) {
      console.log(error);
    }
  };

  const updateStoredPaymentUtxos = async (rawtx: string) => {//这里是异步更新本地存储的支付UTXOs信息。它初始化存储系统，获得当前存储状态，并更新UTXOs的花费状态，以及新交易中获取到的UTXO。
    await init();
    const localStorage = await new Promise<{
      paymentUtxos: StoredUtxo[];
      appState: { addresses: { bsvAddress: string } };
    }>((resolve) => {
      storage.get(['paymentUtxos', 'appState'], (result) => resolve(result));
    });

    const { paymentUtxos, appState } = localStorage;
    const { addresses } = appState;
    const { bsvAddress } = addresses;

    const tx = Transaction.from_hex(rawtx);
    let inputCount = tx.get_ninputs();
    let outputCount = tx.get_noutputs();
    const spends: string[] = [];

    for (let i = 0; i < inputCount; i++) {
      const txIn = tx.get_input(i);
      spends.push(`${txIn!.get_prev_tx_id_hex()}_${txIn!.get_vout()}`);
    }
    paymentUtxos.forEach((utxo) => {
      if (spends.includes(`${utxo.txid}_${utxo.vout}`)) {
        utxo.spent = true;
        utxo.spentUnixTime = getCurrentUtcTimestamp();
      }
    });

    const fundingScript = P2PKHAddress.from_string(bsvAddress!).get_locking_script().to_hex();
    const txid = tx.get_id_hex();

    for (let i = 0; i < outputCount; i++) {
      const txOut = tx.get_output(i);
      const outScript = txOut?.get_script_pub_key_hex();
      if (outScript === fundingScript) {
        paymentUtxos.push({
          satoshis: Number(txOut!.get_satoshis()),
          script: fundingScript,
          txid,
          vout: i,
          spent: false,
          spentUnixTime: 0,
        });
      }
    }
    storage.set({ paymentUtxos });
    return paymentUtxos;
  };

  const getTokenPriceInSats = async (tokenIds: string[]) => {//此函数异步获取一组代币在市场上的最低价格（以sats为单位）。通过发送GET请求到市场API端点，获取每个代币的市场价格，并返回结果数组。
    let result: { id: string; satPrice: number }[] = [];
    for (const tokenId of tokenIds) {
      const { data } = await axios.get<MarketResponse[]>(
        `${getOrdinalsBaseUrl()}/api/bsv20/market?sort=price_per_token&dir=asc&limit=1&offset=0&${
          tokenId.length > 30 ? 'id' : 'tick'
        }=${tokenId}`,
      );
      if (data.length > 0) {
        result.push({ id: tokenId, satPrice: data[0].pricePer });
      }
    }
    return result;
  };

  return {
    getOrdUtxos,
    broadcastWithGorillaPool,
    getUtxoByOutpoint,
    getMarketData,
    getBsv20Balances,
    getBSV20Utxos,
    getLockedUtxos,
    getSpentTxids,
    submitTx,
    getOrdContentByOriginOutpoint,
    setDerivationTags,
    getTxOut,
    getBsv20Details,
    getTokenPriceInSats,
  };
};
