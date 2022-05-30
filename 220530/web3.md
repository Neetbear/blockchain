Web3 {
  currentProvider: [Getter/Setter],
  _requestManager: RequestManager {
    provider: WebsocketProvider {
      _events: [Events <Complex prototype>],
      _eventsCount: 4,
      url: 'ws://localhost:8535',
      _customTimeout: 15000,
      headers: {},
      protocol: undefined,
      reconnectOptions: [Object],
      clientConfig: undefined,
      requestOptions: undefined,
      DATA: 'data',
      CLOSE: 'close',
      ERROR: 'error',
      CONNECT: 'connect',
      RECONNECT: 'reconnect',
      connection: [W3CWebSocket],
      requestQueue: Map(0) {},
      responseQueue: Map(0) {},
      reconnectAttempts: 0,
      reconnecting: false,
      connected: [Getter]
    },
    providers: {
      WebsocketProvider: [Function: WebsocketProvider],
      HttpProvider: [Function: HttpProvider],
      IpcProvider: [Function: IpcProvider]
    },
    subscriptions: Map(0) {}
  },
  givenProvider: null,
  providers: {
    WebsocketProvider: [Function: WebsocketProvider],
    HttpProvider: [Function: HttpProvider],
    IpcProvider: [Function: IpcProvider]
  },
  _provider: WebsocketProvider {
    _events: Events <[Object: null prototype] {}> {
      data: [EE],
      connect: [EE],
      error: [EE],
      disconnect: [EE]
    },
    _eventsCount: 4,
    url: 'ws://localhost:8535',
    _customTimeout: 15000,
    headers: {},
    protocol: undefined,
    reconnectOptions: { auto: false, delay: 5000, maxAttempts: false, onTimeout: false },
    clientConfig: undefined,
    requestOptions: undefined,
    DATA: 'data',
    CLOSE: 'close',
    ERROR: 'error',
    CONNECT: 'connect',
    RECONNECT: 'reconnect',
    connection: W3CWebSocket {
      _listeners: [Object],
      addEventListener: [Function: _addEventListener],
      removeEventListener: [Function: _removeEventListener],
      dispatchEvent: [Function: _dispatchEvent],
      _url: 'ws://localhost:8535',
      _readyState: 0,
      _protocol: undefined,
      _extensions: '',
      _bufferedAmount: 0,
      _binaryType: 'arraybuffer',
      _connection: undefined,
      _client: [WebSocketClient]
    },
    requestQueue: Map(0) {},
    responseQueue: Map(0) {},
    reconnectAttempts: 0,
    reconnecting: false,
    connected: [Getter]
  },
  setProvider: [Function (anonymous)],
  setRequestManager: [Function (anonymous)],
  BatchRequest: [Function: bound Batch],
  extend: [Function: ex] {
    formatters: {
      inputDefaultBlockNumberFormatter: [Function: inputDefaultBlockNumberFormatter],
      inputBlockNumberFormatter: [Function: inputBlockNumberFormatter],
      inputCallFormatter: [Function: inputCallFormatter],
      inputTransactionFormatter: [Function: inputTransactionFormatter],
      inputAddressFormatter: [Function: inputAddressFormatter],
      inputPostFormatter: [Function: inputPostFormatter],
      inputLogFormatter: [Function: inputLogFormatter],
      inputSignFormatter: [Function: inputSignFormatter],
      inputStorageKeysFormatter: [Function: inputStorageKeysFormatter],
      outputProofFormatter: [Function: outputProofFormatter],
      outputBigNumberFormatter: [Function: outputBigNumberFormatter],
      outputTransactionFormatter: [Function: outputTransactionFormatter],
      outputTransactionReceiptFormatter: [Function: outputTransactionReceiptFormatter],
      outputBlockFormatter: [Function: outputBlockFormatter],
      outputLogFormatter: [Function: outputLogFormatter],
      outputPostFormatter: [Function: outputPostFormatter],
      outputSyncingFormatter: [Function: outputSyncingFormatter]
    },
    utils: {
      _fireError: [Function: _fireError],
      _jsonInterfaceMethodToString: [Function: _jsonInterfaceMethodToString],
      _flattenTypes: [Function: _flattenTypes],
      randomHex: [Function: randomHex],
      BN: [Function],
      isBN: [Function: isBN],
      isBigNumber: [Function: isBigNumber],
      isHex: [Function: isHex],
      isHexStrict: [Function: isHexStrict],
      sha3: [Function],
      sha3Raw: [Function: sha3Raw],
      keccak256: [Function],
      soliditySha3: [Function: soliditySha3],
      soliditySha3Raw: [Function: soliditySha3Raw],
      encodePacked: [Function: encodePacked],
      isAddress: [Function: isAddress],
      checkAddressChecksum: [Function: checkAddressChecksum],
      toChecksumAddress: [Function: toChecksumAddress],
      toHex: [Function: toHex],
      toBN: [Function: toBN],
      bytesToHex: [Function: bytesToHex],
      hexToBytes: [Function: hexToBytes],
      hexToNumberString: [Function: hexToNumberString],
      hexToNumber: [Function: hexToNumber],
      toDecimal: [Function: hexToNumber],
      numberToHex: [Function: numberToHex],
      fromDecimal: [Function: numberToHex],
      hexToUtf8: [Function: hexToUtf8],
      hexToString: [Function: hexToUtf8],
      toUtf8: [Function: hexToUtf8],
      stripHexPrefix: [Function: stripHexPrefix],
      utf8ToHex: [Function: utf8ToHex],
      stringToHex: [Function: utf8ToHex],
      fromUtf8: [Function: utf8ToHex],
      hexToAscii: [Function: hexToAscii],
      toAscii: [Function: hexToAscii],
      asciiToHex: [Function: asciiToHex],
      fromAscii: [Function: asciiToHex],
      unitMap: [Object],
      toWei: [Function: toWei],
      fromWei: [Function: fromWei],
      padLeft: [Function: leftPad],
      leftPad: [Function: leftPad],
      padRight: [Function: rightPad],
      rightPad: [Function: rightPad],
      toTwosComplement: [Function: toTwosComplement],
      isBloom: [Function: isBloom],
      isUserEthereumAddressInBloom: [Function: isUserEthereumAddressInBloom],
      isContractAddressInBloom: [Function: isContractAddressInBloom],
      isTopic: [Function: isTopic],
      isTopicInBloom: [Function: isTopicInBloom],
      isInBloom: [Function: isInBloom],
      compareBlockNumbers: [Function: compareBlockNumbers],
      toNumber: [Function: toNumber]
    },
    Method: [Function: Method]
  },
  version: '1.7.3',
  utils: {
    _fireError: [Function: _fireError],
    _jsonInterfaceMethodToString: [Function: _jsonInterfaceMethodToString],
    _flattenTypes: [Function: _flattenTypes],
    randomHex: [Function: randomHex],
    BN: <ref *1> [Function: BN] {
      BN: [Circular *1],
      wordSize: 26,
      isBN: [Function: isBN],
      max: [Function: max],
      min: [Function: min],
      red: [Function: red],
      _prime: [Function: prime],
      mont: [Function: mont]
    },
    isBN: [Function: isBN],
    isBigNumber: [Function: isBigNumber],
    isHex: [Function: isHex],
    isHexStrict: [Function: isHexStrict],
    sha3: [Function: sha3] { _Hash: [Function: keccak256] },
    sha3Raw: [Function: sha3Raw],
    keccak256: [Function: sha3] { _Hash: [Function: keccak256] },
    soliditySha3: [Function: soliditySha3],
    soliditySha3Raw: [Function: soliditySha3Raw],
    encodePacked: [Function: encodePacked],
    isAddress: [Function: isAddress],
    checkAddressChecksum: [Function: checkAddressChecksum],
    toChecksumAddress: [Function: toChecksumAddress],
    toHex: [Function: toHex],
    toBN: [Function: toBN],
    bytesToHex: [Function: bytesToHex],
    hexToBytes: [Function: hexToBytes],
    hexToNumberString: [Function: hexToNumberString],
    hexToNumber: [Function: hexToNumber],
    toDecimal: [Function: hexToNumber],
    numberToHex: [Function: numberToHex],
    fromDecimal: [Function: numberToHex],
    hexToUtf8: [Function: hexToUtf8],
    hexToString: [Function: hexToUtf8],
    toUtf8: [Function: hexToUtf8],
    stripHexPrefix: [Function: stripHexPrefix],
    utf8ToHex: [Function: utf8ToHex],
    stringToHex: [Function: utf8ToHex],
    fromUtf8: [Function: utf8ToHex],
    hexToAscii: [Function: hexToAscii],
    toAscii: [Function: hexToAscii],
    asciiToHex: [Function: asciiToHex],
    fromAscii: [Function: asciiToHex],
    unitMap: {
      noether: '0',
      wei: '1',
      kwei: '1000',
      Kwei: '1000',
      babbage: '1000',
      femtoether: '1000',
      mwei: '1000000',
      Mwei: '1000000',
      lovelace: '1000000',
      picoether: '1000000',
      gwei: '1000000000',
      Gwei: '1000000000',
      shannon: '1000000000',
      nanoether: '1000000000',
      nano: '1000000000',
      szabo: '1000000000000',
      microether: '1000000000000',
      micro: '1000000000000',
      finney: '1000000000000000',
      milliether: '1000000000000000',
      milli: '1000000000000000',
      ether: '1000000000000000000',
      kether: '1000000000000000000000',
      grand: '1000000000000000000000',
      mether: '1000000000000000000000000',
      gether: '1000000000000000000000000000',
      tether: '1000000000000000000000000000000'
    },
    toWei: [Function: toWei],
    fromWei: [Function: fromWei],
    padLeft: [Function: leftPad],
    leftPad: [Function: leftPad],
    padRight: [Function: rightPad],
    rightPad: [Function: rightPad],
    toTwosComplement: [Function: toTwosComplement],
    isBloom: [Function: isBloom],
    isUserEthereumAddressInBloom: [Function: isUserEthereumAddressInBloom],
    isContractAddressInBloom: [Function: isContractAddressInBloom],
    isTopic: [Function: isTopic],
    isTopicInBloom: [Function: isTopicInBloom],
    isInBloom: [Function: isInBloom],
    compareBlockNumbers: [Function: compareBlockNumbers],
    toNumber: [Function: toNumber]
  },
  eth: <ref *2> Eth {
    currentProvider: [Getter/Setter],
    _requestManager: RequestManager {
      provider: [WebsocketProvider],
      providers: [Object],
      subscriptions: Map(0) {}
    },
    givenProvider: null,
    providers: {
      WebsocketProvider: [Function: WebsocketProvider],
      HttpProvider: [Function: HttpProvider],
      IpcProvider: [Function: IpcProvider]
    },
    _provider: WebsocketProvider {
      _events: [Events <Complex prototype>],
      _eventsCount: 4,
      url: 'ws://localhost:8535',
      _customTimeout: 15000,
      headers: {},
      protocol: undefined,
      reconnectOptions: [Object],
      clientConfig: undefined,
      requestOptions: undefined,
      DATA: 'data',
      CLOSE: 'close',
      ERROR: 'error',
      CONNECT: 'connect',
      RECONNECT: 'reconnect',
      connection: [W3CWebSocket],
      requestQueue: Map(0) {},
      responseQueue: Map(0) {},
      reconnectAttempts: 0,
      reconnecting: false,
      connected: [Getter]
    },
    setProvider: [Function (anonymous)],
    setRequestManager: [Function (anonymous)],
    BatchRequest: [Function: bound Batch],
    extend: [Function: ex] {
      formatters: [Object],
      utils: [Object],
      Method: [Function: Method]
    },
    handleRevert: [Getter/Setter],
    defaultCommon: [Getter/Setter],
    defaultHardfork: [Getter/Setter],
    defaultChain: [Getter/Setter],
    transactionPollingTimeout: [Getter/Setter],
    transactionPollingInterval: [Getter/Setter],
    transactionConfirmationBlocks: [Getter/Setter],
    transactionBlockTimeout: [Getter/Setter],
    blockHeaderTimeout: [Getter/Setter],
    defaultAccount: [Getter/Setter],
    defaultBlock: [Getter/Setter],
    maxListenersWarningThreshold: [Getter/Setter],
    clearSubscriptions: [Function: bound ],
    removeSubscriptionById: [Function: bound ],
    net: Net {
      currentProvider: [Getter/Setter],
      _requestManager: [RequestManager],
      givenProvider: null,
      providers: [Object],
      _provider: [WebsocketProvider],
      setProvider: [Function (anonymous)],
      setRequestManager: [Function (anonymous)],
      BatchRequest: [Function: bound Batch],
      extend: [Function],
      getId: [Function],
      isListening: [Function],
      getPeerCount: [Function],
      getNetworkType: [Function: bound getNetworkType]
    },
    accounts: Accounts {
      currentProvider: [Getter/Setter],
      _requestManager: [RequestManager],
      givenProvider: null,
      providers: [Object],
      _provider: [WebsocketProvider],
      setProvider: [Function (anonymous)],
      setRequestManager: [Function (anonymous)],
      _ethereumCall: [Object],
      wallet: [Wallet]
    },
    personal: Personal {
      currentProvider: [Getter/Setter],
      _requestManager: [RequestManager],
      givenProvider: null,
      providers: [Object],
      _provider: [WebsocketProvider],
      setProvider: [Function (anonymous)],
      setRequestManager: [Function (anonymous)],
      BatchRequest: [Function: bound Batch],
      extend: [Function],
      net: [Net],
      defaultAccount: [Getter/Setter],
      defaultBlock: [Getter/Setter],
      getAccounts: [Function],
      newAccount: [Function],
      unlockAccount: [Function],
      lockAccount: [Function],
      importRawKey: [Function],
      sendTransaction: [Function],
      signTransaction: [Function],
      sign: [Function],
      ecRecover: [Function]
    },
    Contract: [Function: Contract] {
      setProvider: [Function (anonymous)],
      defaultAccount: null,
      defaultBlock: 'latest',
      transactionBlockTimeout: 50,
      transactionConfirmationBlocks: 24,
      transactionPollingTimeout: 750,
      transactionPollingInterval: 1000,
      blockHeaderTimeout: 10,
      handleRevert: false,
      _requestManager: [RequestManager],
      _ethAccounts: [Accounts],
      currentProvider: [WebsocketProvider]
    },
    Iban: [class Iban],
    abi: ABICoder {},
    ens: ENS {
      eth: [Circular *2],
      _detectedAddress: null,
      _lastSyncCheck: null,
      registry: [Getter],
      resolverMethodHandler: [Getter],
      registryAddress: [Getter/Setter]
    },
    getNodeInfo: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'web3_clientVersion'
    },
    getProtocolVersion: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_protocolVersion'
    },
    getCoinbase: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_coinbase'
    },
    isMining: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_mining'
    },
    getHashrate: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_hashrate'
    },
    isSyncing: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_syncing'
    },
    getGasPrice: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_gasPrice'
    },
    getFeeHistory: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_feeHistory'
    },
    getAccounts: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_accounts'
    },
    getBlockNumber: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_blockNumber'
    },
    getBalance: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_getBalance'
    },
    getStorageAt: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_getStorageAt'
    },
    getCode: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_getCode'
    },
    getBlock: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: [Function: blockCall]
    },
    getUncle: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: [Function: uncleCall]
    },
    getBlockTransactionCount: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: [Function: getBlockTransactionCountCall]
    },
    getBlockUncleCount: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: [Function: uncleCountCall]
    },
    getTransaction: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_getTransactionByHash'
    },
    getTransactionFromBlock: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: [Function: transactionFromBlockCall]
    },
    getTransactionReceipt: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_getTransactionReceipt'
    },
    getTransactionCount: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_getTransactionCount'
    },
    sendSignedTransaction: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_sendRawTransaction'
    },
    signTransaction: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_signTransaction'
    },
    sendTransaction: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_sendTransaction'
    },
    sign: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_sign'
    },
    call: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_call'
    },
    estimateGas: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_estimateGas'
    },
    submitWork: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_submitWork'
    },
    getWork: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_getWork'
    },
    getPastLogs: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_getLogs'
    },
    getChainId: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_chainId'
    },
    requestAccounts: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_requestAccounts'
    },
    getProof: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_getProof'
    },
    getPendingTransactions: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_pendingTransactions'
    },
    createAccessList: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'eth_createAccessList'
    },
    subscribe: [Function (anonymous)]
  },
  shh: Shh {
    currentProvider: [Getter/Setter],
    _requestManager: RequestManager {
      provider: [WebsocketProvider],
      providers: [Object],
      subscriptions: Map(0) {}
    },
    givenProvider: null,
    providers: {
      WebsocketProvider: [Function: WebsocketProvider],
      HttpProvider: [Function: HttpProvider],
      IpcProvider: [Function: IpcProvider]
    },
    _provider: WebsocketProvider {
      _events: [Events <Complex prototype>],
      _eventsCount: 4,
      url: 'ws://localhost:8535',
      _customTimeout: 15000,
      headers: {},
      protocol: undefined,
      reconnectOptions: [Object],
      clientConfig: undefined,
      requestOptions: undefined,
      DATA: 'data',
      CLOSE: 'close',
      ERROR: 'error',
      CONNECT: 'connect',
      RECONNECT: 'reconnect',
      connection: [W3CWebSocket],
      requestQueue: Map(0) {},
      responseQueue: Map(0) {},
      reconnectAttempts: 0,
      reconnecting: false,
      connected: [Getter]
    },
    setProvider: [Function (anonymous)],
    setRequestManager: [Function (anonymous)],
    BatchRequest: [Function: bound Batch],
    extend: [Function: ex] {
      formatters: [Object],
      utils: [Object],
      Method: [Function: Method]
    },
    net: Net {
      currentProvider: [Getter/Setter],
      _requestManager: [RequestManager],
      givenProvider: null,
      providers: [Object],
      _provider: [WebsocketProvider],
      setProvider: [Function (anonymous)],
      setRequestManager: [Function (anonymous)],
      BatchRequest: [Function: bound Batch],
      extend: [Function],
      getId: [Function],
      isListening: [Function],
      getPeerCount: [Function]
    },
    subscribe: [Function (anonymous)],
    getVersion: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_version'
    },
    getInfo: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_info'
    },
    setMaxMessageSize: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_setMaxMessageSize'
    },
    setMinPoW: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_setMinPoW'
    },
    markTrustedPeer: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_markTrustedPeer'
    },
    newKeyPair: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_newKeyPair'
    },
    addPrivateKey: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_addPrivateKey'
    },
    deleteKeyPair: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_deleteKeyPair'
    },
    hasKeyPair: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_hasKeyPair'
    },
    getPublicKey: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_getPublicKey'
    },
    getPrivateKey: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_getPrivateKey'
    },
    newSymKey: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_newSymKey'
    },
    addSymKey: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_addSymKey'
    },
    generateSymKeyFromPassword: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_generateSymKeyFromPassword'
    },
    hasSymKey: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_hasSymKey'
    },
    getSymKey: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_getSymKey'
    },
    deleteSymKey: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_deleteSymKey'
    },
    newMessageFilter: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_newMessageFilter'
    },
    getFilterMessages: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_getFilterMessages'
    },
    deleteMessageFilter: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_deleteMessageFilter'
    },
    post: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_post'
    },
    unsubscribe: [Function: send] {
      method: [Method],
      request: [Function: bound ],
      call: 'shh_unsubscribe'
    }
  },
  bzz: Bzz {
    givenProvider: null,
    currentProvider: null,
    isAvailable: [Function (anonymous)],
    upload: [Function (anonymous)],
    download: [Function (anonymous)]
  }
}