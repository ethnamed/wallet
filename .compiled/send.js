// Generated by LiveScript 1.6.0
(function(){
  var react, toJS, ref$, times, minus, createTransaction, pushTx, changeAmount, notifyFormResult, getNameMask, resolveAddress, ethnamed, window, navigate, close, send;
  react = require('react');
  toJS = require('mobx').toJS;
  ref$ = require('./math.ls'), times = ref$.times, minus = ref$.minus;
  ref$ = require('./api.ls'), createTransaction = ref$.createTransaction, pushTx = ref$.pushTx;
  changeAmount = require('./change-amount.ls');
  notifyFormResult = require('./send-form.ls').notifyFormResult;
  getNameMask = require('./get-name-mask.ls');
  resolveAddress = require('./resolve-address.ls');
  ethnamed = require('./ethnamed.ls');
  window = require('./browser/window.ls');
  navigate = require('./navigate.ls');
  close = require('./close.ls');
  send = function(arg$){
    var store, sendTo, send, wallet, link, sendTx, performSendSafe, performSendUnsafe, sendMoney, sendEscrow, cancel, recepientChange, amountChange, encodeDecode, showData, showLabel, whenEmpty, history, topup, network, receive, token, isData, ref$, children;
    store = arg$.store;
    if (store == null) {
      return null;
    }
    sendTo = ethnamed(store).sendTo;
    send = store.current.send;
    wallet = send.coin.wallet;
    link = send.network.api.url + "/address/" + send.address;
    sendTx = function(arg$, cb){
      var to, wallet, network, amountSend, amountSendFee, data, coin, token, tx;
      to = arg$.to, wallet = arg$.wallet, network = arg$.network, amountSend = arg$.amountSend, amountSendFee = arg$.amountSendFee, data = arg$.data, coin = arg$.coin;
      token = send.coin.token;
      tx = {
        sender: {
          address: wallet.address,
          privateKey: wallet.privateKey
        },
        recepient: to,
        network: network,
        token: token,
        coin: coin,
        amount: amountSend,
        amountFee: amountSendFee,
        data: data
      };
      return createTransaction(tx, function(err, data){
        var agree;
        if (err != null) {
          return cb(err);
        }
        agree = confirm("Are you sure to send " + tx.amount + " " + send.coin.token + " to " + send.to);
        if (!agree) {
          return cb("You are not agree");
        }
        return pushTx((import$({
          token: token,
          network: network
        }, data)), function(err, tx){
          return cb(err, tx);
        });
      });
    };
    performSendSafe = function(cb){
      return resolveAddress(send.to, send.coin, send.network, function(err, to){
        var ref$;
        send.proposeEscrow = err === "Address not found" && send.coin.token === 'eth';
        if (err != null) {
          return cb(err);
        }
        send.to = to;
        if (err != null) {
          send.error = (ref$ = err.message) != null ? ref$ : err;
        }
        if (err != null) {
          return cb(err);
        }
        return sendTx((import$({
          wallet: wallet
        }, send)), cb);
      });
    };
    performSendUnsafe = function(cb){
      return sendTx((import$({
        wallet: wallet
      }, send)), cb);
    };
    sendMoney = function(event){
      if (send.sending === true) {
        return;
      }
      send.sending = true;
      return performSendSafe(function(err, data){
        var ref$;
        send.sending = false;
        if (err != null) {
          return send.error = (ref$ = err.message) != null ? ref$ : err;
        }
        notifyFormResult(send.id, null, data);
        store.current.lastTxUrl = send.network.api.url + "/transfer/" + data;
        return navigate(store, 'sent');
      });
    };
    sendEscrow = function(event){
      var name, amountEthers;
      name = send.to;
      amountEthers = send.amountSend;
      return sendTo({
        name: name,
        amountEthers: amountEthers
      }, function(err){});
    };
    cancel = function(event){
      navigate(store, 'wallets');
      return notifyFormResult(send.id, "Cancelled by user");
    };
    recepientChange = function(event){
      var ref$;
      return send.to = (ref$ = event.target.value) != null ? ref$ : "";
    };
    amountChange = function(event){
      var value, ref$, value2;
      value = (ref$ = event.target.value.match(/^[0-9]+([.]([0-9]+)?)?$/)) != null ? ref$[0] : void 8;
      value2 = (function(){
        switch (false) {
        case !((value != null ? value[0] : void 8) === '0' && (value != null ? value[1] : void 8) != null && (value != null ? value[1] : void 8) !== '.'):
          return value.substr(1, value.length);
        default:
          return value;
        }
      }());
      return changeAmount(store, value2);
    };
    encodeDecode = function(){
      return send.showDataMode = (function(){
        switch (false) {
        case send.showDataMode !== 'decoded':
          return 'encoded';
        default:
          return 'decoded';
        }
      }());
    };
    showData = function(){
      switch (false) {
      case send.showDataMode !== 'decoded':
        return send.decodedData;
      default:
        return send.data;
      }
    };
    showLabel = function(){
      if (send.showDataMode === 'decoded') {
        return 'encoded';
      } else {
        return 'decoded';
      }
    };
    whenEmpty = function(str, def){
      if ((str != null ? str : "").length === 0) {
        return def;
      } else {
        return str;
      }
    };
    history = function(){
      store.current.filter = ['IN', 'OUT', wallet.coin.token];
      return navigate(store, 'history');
    };
    topup = function(){
      return alert("Topup Service is not installed");
    };
    network = (function(){
      switch (false) {
      case store.current.network !== 'testnet':
        return " (TESTNET) ";
      default:
        return "";
      }
    }());
    receive = function(){
      return navigate(store, 'receive');
    };
    token = send.coin.token.toUpperCase();
    isData = ((ref$ = send.data) != null ? ref$ : "").length > 0;
    return react.createElement('div', {
      className: 'content content1469325038'
    }, children = [
      react.createElement('div', {
        className: 'content-body'
      }, children = [
        react.createElement('div', {
          className: 'padded-content'
        }, children = [
          react.createElement('div', {}, children = react.createElement('h2', {
            className: 'font-light m-b-xs'
          }, children = [
            react.createElement('span', {
              className: 'head'
            }, children = react.createElement('div', {
              className: 'title'
            }, ' ' + token + network + ' WALLET')), react.createElement('span', {
              className: 'head right'
            }, children = react.createElement('img', {
              src: wallet.coin.image + ""
            }))
          ])), react.createElement('div', {}, children = react.createElement('form', {
            method: 'get'
          }, children = [
            react.createElement('div', {
              className: 'form-group'
            }, children = [
              react.createElement('label', {
                className: 'control-label'
              }, ' Send From'), react.createElement('div', {
                className: 'address'
              }, children = react.createElement('a', {
                href: link + ""
              }, ' ' + wallet.address))
            ]), react.createElement('div', {
              className: 'form-group'
            }, children = [
              react.createElement('label', {
                className: 'control-label'
              }, ' Recepient'), react.createElement('div', {}, children = react.createElement('input', {
                type: 'text',
                onChange: recepientChange,
                value: send.to + "",
                placeholder: store.current.sendToMask + ""
              }))
            ]), react.createElement('div', {
              className: 'form-group'
            }, children = [
              react.createElement('label', {
                className: 'control-label'
              }, children = react.createElement('span', {}, ' Amount')), react.createElement('div', {}, children = [
                react.createElement('div', {}, children = [
                  react.createElement('input', {
                    type: 'text',
                    onChange: amountChange,
                    placeholder: "0",
                    value: send.amountSend + "",
                    className: 'amount'
                  }), wallet.network.topup ? react.createElement('a', {
                    href: wallet.network.topup + "",
                    target: "_blank",
                    className: 'topup'
                  }, ' Top up?') : void 8
                ]), react.createElement('div', {
                  className: 'usd'
                }, ' Balance ' + wallet.balance), react.createElement('div', {
                  className: 'control-label not-enough text-left'
                }, ' ' + send.error)
              ])
            ]), isData ? react.createElement('div', {
              className: 'form-group'
            }, children = [
              react.createElement('label', {
                className: 'control-label'
              }, children = [
                react.createElement('span', {}, ' Data'), react.createElement('span', {
                  className: 'gray'
                })
              ]), react.createElement('div', {}, children = [
                react.createElement('input', {
                  readOnly: "readonly",
                  value: showData() + ""
                }), react.createElement('button', {
                  type: "button",
                  onClick: encodeDecode
                }, ' Show ' + showLabel())
              ])
            ]) : void 8, react.createElement('div', {}, children = react.createElement('table', {
              className: 'table table-striped'
            }, children = react.createElement('tbody', {}, children = [
              react.createElement('tr', {}, children = [
                react.createElement('td', {}, ' You Send '), react.createElement('td', {}, children = [
                  react.createElement('div', {}, ' ' + whenEmpty(send.amountSend, 0) + '  ' + token), react.createElement('div', {
                    className: 'usd'
                  }, ' $ ' + send.amountSendUsd)
                ])
              ]), react.createElement('tr', {
                className: 'green'
              }, children = [
                react.createElement('td', {}, ' Recepient obtains'), react.createElement('td', {}, children = [
                  react.createElement('div', {
                    className: 'bold'
                  }, ' ' + send.amountObtain + '  ' + token), react.createElement('div', {
                    className: 'usd'
                  }, ' $ ' + send.amountObtainUsd)
                ])
              ]), react.createElement('tr', {
                className: 'orange'
              }, children = [
                react.createElement('td', {}, ' Transaction Fee '), react.createElement('td', {}, children = [
                  react.createElement('div', {}, ' ' + send.amountSendFee + '  ' + token), react.createElement('div', {
                    className: 'usd'
                  }, ' $ ' + send.amountSendFeeUsd)
                ])
              ])
            ]))), react.createElement('div', {
              className: 'escrow'
            }, children = send.proposeEscrow ? react.createElement('div', {}, ' You can send this funds to the Ethnamed smart-contract. Once the owner register the name he will obtain funds automatically') : void 8)
          ]))
        ]), react.createElement('div', {
          className: 'buttons'
        }, children = react.createElement('div', {}, children = [
          send.proposeEscrow
            ? react.createElement('a', {
              onClick: sendEscrow,
              className: 'btn btn-primary'
            }, children = [react.createElement('span', {}, ' Send (Escrow)'), send.sending ? react.createElement('span', {}, ' ...') : void 8])
            : react.createElement('a', {
              onClick: sendMoney,
              className: 'btn btn-primary'
            }, children = [react.createElement('span', {}, ' Send'), send.sending ? react.createElement('span', {}, ' ...') : void 8]), react.createElement('a', {
            onClick: cancel,
            className: 'btn btn-default'
          }, ' Cancel')
        ]))
      ]), !isData ? react.createElement('div', {
        className: 'more-buttons'
      }, children = [
        react.createElement('a', {
          onClick: receive,
          className: 'more receive'
        }, ' Receive'), react.createElement('a', {
          onClick: history,
          className: 'more history'
        }, ' History'), react.createElement('a', {
          onClick: topup,
          className: 'more history'
        }, ' Topup')
      ]) : void 8
    ]);
  };
  module.exports = send;
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
