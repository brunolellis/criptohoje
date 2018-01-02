function byId(id) {
    return document.getElementById(id);
}

function convertFromBRL() {
    var reais = byId('brl').value;

    moedas.map(m => byId(m.ticker).value = m.fromBaseCoin(reais));
}

class Cripto {
    constructor({
        ticker,
        url
    }) {
        this.proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        this.ticker = ticker;
        this.url = this.proxyUrl + url;
        this.name = this.constructor.name;
        this.iconUrl = 'https://files.coinmarketcap.com/static/img/coins/128x128/' + this.name.toLowerCase() + '.png';
    }

    setPrice(price) {
        this.price = this.stringToNumber(price);
    }

    getPrice(divider = ',') {
        return this.price.replace('.', divider);
    }

    fromBaseCoin(coin) {
        return (this.stringToNumber(coin) / this.price).toFixed(7);
    }

    stringToNumber(str) {
        return parseFloat(str
            .replace(/\./g, ',')
            .replace(/[^0-9\.,]/g, '')
            .replace(/(.*),/, x => x.replace(/,/g, '') + ',')
            .replace(',', '.'));
    }

}

class Bitcoin extends Cripto {
    constructor() {
        super({
            ticker: 'BTC',
            url: 'http://dolarhoje.com/bitcoin-hoje/cotacao.txt'
        })
    }
}

class RaiBlocks extends Cripto {
    constructor() {
        super({
            ticker: 'XRB',
            url: 'http://dolarhoje.com/raiblocks-hoje/cotacao.txt'
        })
    }
}

class Ripple extends Cripto {
    constructor() {
        super({
            ticker: 'XRP',
            url: 'http://dolarhoje.com/ripple/cotacao.txt'
        })
    }
}

class Litecoin extends Cripto {
    constructor() {
        super({
            ticker: 'LTC',
            url: 'http://dolarhoje.com/litecoin/cotacao.txt'
        })
    }
}

class Ethereum extends Cripto {
    constructor() {
        super({
            ticker: 'ETH',
            url: 'http://dolarhoje.com/ethereum/cotacao.txt'
        })
    }
}



let btc = new Bitcoin();
let xrb = new RaiBlocks();
let xrp = new Ripple();
let ltc = new Litecoin();
let eth = new Ethereum();
let moedas = [btc, xrb, xrp, ltc, eth];

let requests = moedas.map((c) => fetch(c.url).then(res => res.text()));
Promise
    .all(requests)
    .then((responses) => {
        for (var i in responses) {
            var moeda = moedas[i];
            moeda.setPrice(responses[i]);
            byId(moeda.ticker + '-price').innerText = responses[i];
        }
    })
    .catch((err) => {
        console.log(err);
    });
