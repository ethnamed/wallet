// Generated by LiveScript 1.6.0
(function(){
  var react, toJS, ref$, times, minus, createTransaction, pushTx, changeAmount, calcCrypto, notifyFormResult, getNameMask, resolveAddress, ethnamed, window, navigate, close, round, round5, send;
  react = require('react');
  toJS = require('mobx').toJS;
  ref$ = require('./math.ls'), times = ref$.times, minus = ref$.minus;
  ref$ = require('./api.ls'), createTransaction = ref$.createTransaction, pushTx = ref$.pushTx;
  ref$ = require('./calc-amount.ls'), changeAmount = ref$.changeAmount, calcCrypto = ref$.calcCrypto;
  notifyFormResult = require('./send-form.ls').notifyFormResult;
  getNameMask = require('./get-name-mask.ls');
  resolveAddress = require('./resolve-address.ls');
  ethnamed = require('./ethnamed.ls');
  window = require('./browser/window.ls');
  navigate = require('./navigate.ls');
  close = require('./close.ls');
  round = require('./round.ls');
  round5 = require('./round5.ls');
  send = function(arg$){
    var store, sendTo, send, wallet, link, sendTx, performSendSafe, performSendUnsafe, sendMoney, sendEscrow, sendAnyway, sendTitle, cancel, recepientChange, getValue, amountChange, amountUsdChange, encodeDecode, showData, showLabel, whenEmpty, history, topup, network, receive, token, isData, ref$, formGroup, children;
    store = arg$.store;
    if (store == null) {
      return null;
    }
    sendTo = ethnamed(store).sendTo;
    send = store.current.send;
    wallet = send.wallet;
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
    sendMoney = function(){
      if (wallet.balance === '...') {
        return;
      }
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
    sendEscrow = function(){
      var name, amountEthers;
      name = send.to;
      amountEthers = send.amountSend;
      return sendTo({
        name: name,
        amountEthers: amountEthers
      }, function(err){});
    };
    sendAnyway = function(){
      if (send.proposeEscrow) {
        return sendEscrow();
      }
      return sendMoney();
    };
    sendTitle = (function(){
      switch (false) {
      case !send.proposeEscrow:
        return 'SEND (Escrow)';
      default:
        return "Send";
      }
    }());
    cancel = function(event){
      navigate(store, 'wallets');
      return notifyFormResult(send.id, "Cancelled by user");
    };
    recepientChange = function(event){
      var ref$;
      return send.to = (ref$ = event.target.value) != null ? ref$ : "";
    };
    getValue = function(event){
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
      return value2;
    };
    amountChange = function(event){
      var value;
      value = getValue(event);
      return changeAmount(store, value);
    };
    amountUsdChange = function(event){
      var value, toSend;
      value = getValue(event);
      toSend = calcCrypto(store, value);
      return changeAmount(store, toSend);
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
      store.current.filter = ['IN', 'OUT', send.coin.token];
      return navigate(store, 'history');
    };
    topup = function(){
      if (wallet.network.topup) {
        return window.open(wallet.network.topup);
      } else {
        return alert("Topup Service is not installed");
      }
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
    formGroup = function(title, content){
      var children;
      return react.createElement('div', {
        className: 'form-group'
      }, children = [
        react.createElement('label', {
          className: 'control-label'
        }, ' ' + title), content()
      ]);
    };
    return react.createElement('div', {
      className: 'content content-1673245415'
    }, children = [
      react.createElement('div', {
        className: 'decoration'
      }), react.createElement('div', {
        className: 'content-body'
      }, children = [
        react.createElement('div', {
          className: 'header'
        }, children = [
          react.createElement('span', {
            className: 'head'
          }, ' ' + token + network + ' WALLET'), react.createElement('span', {
            className: 'head right'
          }, children = react.createElement('img', {
            src: send.coin.image + ""
          }))
        ]), react.createElement('form', {}, children = [
          formGroup('Send From', function(){
            var children;
            return react.createElement('div', {
              className: 'address'
            }, children = react.createElement('a', {
              href: link + ""
            }, ' ' + wallet.address));
          }), formGroup('Recepient', function(){
            return react.createElement('input', {
              type: 'text',
              onChange: recepientChange,
              value: send.to + "",
              placeholder: store.current.sendToMask + ""
            });
          }), formGroup('Amount', function(){
            var children;
            return react.createElement('div', {}, children = [
              react.createElement('div', {
                className: 'amount-field'
              }, children = [
                react.createElement('div', {
                  className: 'input-wrapper'
                }, children = [
                  react.createElement('div', {
                    className: 'label crypto'
                  }, ' ' + token), react.createElement('input', {
                    type: 'text',
                    onChange: amountChange,
                    placeholder: "0",
                    value: round5(send.amountSend) + "",
                    className: 'amount'
                  })
                ]), react.createElement('div', {
                  className: 'input-wrapper'
                }, children = [
                  react.createElement('div', {
                    className: 'label lusd'
                  }, ' $'), react.createElement('input', {
                    type: 'text',
                    onChange: amountUsdChange,
                    placeholder: "0",
                    value: round5(send.amountSendUsd) + "",
                    className: 'amount-usd'
                  })
                ])
              ]), react.createElement('div', {
                className: 'usd'
              }, children = [
                react.createElement('span', {}, ' Balance'), react.createElement('span', {
                  className: 'balance'
                }, ' ' + wallet.balance + ' ' + token + ' ')
              ]), react.createElement('div', {
                className: 'control-label not-enough text-left'
              }, ' ' + send.error)
            ]);
          }), isData ? formGroup('Data', function(){
            var children;
            return react.createElement('div', {}, children = [
              react.createElement('input', {
                readOnly: "readonly",
                value: showData() + ""
              }), react.createElement('button', {
                type: "button",
                onClick: encodeDecode
              }, ' Show ' + showLabel())
            ]);
          }) : void 8, react.createElement('table', {}, children = react.createElement('tbody', {}, children = [
            react.createElement('tr', {}, children = [
              react.createElement('td', {}, ' You Spend '), react.createElement('td', {}, children = [
                react.createElement('div', {}, ' ' + round5(send.amountCharged) + '  ' + token), react.createElement('div', {
                  className: 'usd'
                }, ' $ ' + round5(send.amountChargedUsd))
              ])
            ]), react.createElement('tr', {
              className: 'green'
            }, children = [
              react.createElement('td', {}, ' Recepient Obtains'), react.createElement('td', {}, children = [
                react.createElement('div', {
                  className: 'bold'
                }, ' ' + round5(send.amountObtain) + '  ' + token), react.createElement('div', {
                  className: 'usd'
                }, ' $ ' + round5(send.amountObtainUsd))
              ])
            ]), react.createElement('tr', {
              className: 'orange'
            }, children = [
              react.createElement('td', {}, ' Transaction Fee'), react.createElement('td', {}, children = [
                react.createElement('div', {}, ' ' + round5(send.amountSendFee) + '  ' + token), react.createElement('div', {
                  className: 'usd'
                }, ' $ ' + round5(send.amountSendFeeUsd))
              ])
            ])
          ])), react.createElement('div', {
            className: 'escrow'
          }, children = send.proposeEscrow ? react.createElement('div', {}, ' You can send this funds to the Ethnamed smart-contract. Once the owner register the name he will obtain funds automatically') : void 8)
        ]), react.createElement('div', {
          className: 'button-container'
        }, children = react.createElement('div', {
          className: 'buttons'
        }, children = [
          react.createElement('a', {
            onClick: sendAnyway,
            className: 'btn btn-primary'
          }, children = [react.createElement('span', {}, ' ' + sendTitle), send.sending ? react.createElement('span', {}, ' ...') : void 8]), react.createElement('a', {
            onClick: cancel,
            className: 'btn btn-default'
          }, ' CANCEL')
        ]))
      ]), !isData ? react.createElement('div', {
        className: 'more-buttons'
      }, children = [
        react.createElement('a', {
          onClick: receive,
          className: 'more receive'
        }, ' RECEIVE'), react.createElement('a', {
          onClick: history,
          className: 'more history'
        }, ' HISTORY'), react.createElement('a', {
          onClick: topup,
          className: 'more history'
        }, ' TOPUP')
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
