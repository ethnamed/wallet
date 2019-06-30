require! {
    \./plugin-loader.ls : { get-coins }
    \prelude-ls : { map, pairs-to-obj }
    \./seed.ls : { saved }
    \./browser/location.ls
}
saved-seed = saved!
create-send =->
    id: ""
    to: ""
    propose-escrow: no
    address: ''
    value: \0
    fee-type: \auto
    tx-type: \regular
    amount-send: \0
    amount-charged: \0
    amount-charged-usd: \0
    amount-send-usd: \0
    amount-send-eur: \0
    amount-send-fee: \0
    amount-send-fee-usd: \0
    amount-obtain: \0
    data: ""
    decoded-data: ""
    show-data-mode: \encoded
    error: ''
store =
    root: null
    registry: []
    menu:
        active: 's2'
    ask: 
        text: ''
        enabled: no
        callback: null
        image: ""
        type: ''
    current:
        list: 0
        add-coin: no
        wallet-index: 0
        account-index: 1
        manage-account: no
        filter-plugins: ""
        confirmation: null
        demo: location.href.index-of('web3.space/wallet') > -1 
        network: \mainnet
        pin: ""
        last-tx-url: ""
        try-edit-seed: no
        pin-trial: 0
        refreshing: no
        copied: ""
        page: \locked
        send-to-mask: ""
        status: \main
        nickname: ""
        nicknamefull: \nickname@domain.com
        message: ""
        custom-domain: no
        can-buy: no
        checking-name: no
        seed: ""
        saved-seed: saved-seed
        balance-usd: \...
        filter: <[ IN OUT ]>
        loading: no
        send : create-send!
        invoice : create-send!
    rates: 
        get-coins! 
            |> map -> [it.token.to-upper-case!, USD: 0] 
            |> pairs-to-obj
module.exports = store