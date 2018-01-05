var baseBRL = 100;

class Cripto {
    constructor({
        token,
        url
    }) {
        this.proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        this.token = token;
        this.url = this.proxyUrl + url;
        this.name = this.constructor.name;
        this.iconUrl = 'https://files.coinmarketcap.com/static/img/coins/128x128/' + this.name.toLowerCase() + '.png';
        this.price = undefined;
        this.conversion = undefined;
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
        if (typeof str === 'number') {
            return str;
        }

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
            token: 'BTC',
            url: 'http://dolarhoje.com/bitcoin-hoje/cotacao.txt'
        })
    }
}

class RaiBlocks extends Cripto {
    constructor() {
        super({
            token: 'XRB',
            url: 'http://dolarhoje.com/raiblocks-hoje/cotacao.txt'
        })
    }
}

class Ripple extends Cripto {
    constructor() {
        super({
            token: 'XRP',
            url: 'http://dolarhoje.com/ripple/cotacao.txt'
        })
    }
}

class Litecoin extends Cripto {
    constructor() {
        super({
            token: 'LTC',
            url: 'http://dolarhoje.com/litecoin/cotacao.txt'
        })
    }
}

class Ethereum extends Cripto {
    constructor() {
        super({
            token: 'ETH',
            url: 'http://dolarhoje.com/ethereum/cotacao.txt'
        })
    }
}

class Tron extends Cripto {
    constructor() {
        super({
            token: 'TRX',
            url: 'http://dolarhoje.com/tron-hoje/cotacao.txt'
        })
    }
}


let btc = new Bitcoin();
let eth = new Ethereum();
let ltc = new Litecoin();
let xrp = new Ripple();
let xrb = new RaiBlocks();
let trx = new Tron();
let moedas = [btc, eth, ltc, xrp, xrb, trx];

let requests = moedas.map(c => fetch(c.url).then(res => res.text()));
Promise
    .all(requests)
    .then((responses) => {
        for (var i in responses) {
            var moeda = moedas[i];
            moeda.setPrice(responses[i]);
            moeda.brl = baseBRL;
        }
    })
    .catch((err) => {
        console.log(err);
    });





Vue.component('moeda', {
    props: ['moeda', 'brl'],
    methods: {
        qtyUpdated() {
            console.log(this.moeda.qty * this.moeda.price);
            var brl = this.moeda.qty * this.moeda.price;

            this.$emit('brl-updated', brl);
            this.$forceUpdate();
        }
    },
    computed:  {
        fromBRL() {
            if (!this.moeda || !this.moeda.price) return;

            if (!this.moeda.qty) {
                this.moeda.qty = this.brl / this.moeda.price;
                this.$forceUpdate();
            }
        }
        
    },
    template: `
        <div class="one-third column coin-column" :style="'background-image: url(https://files.coinmarketcap.com/static/img/coins/128x128/' + moeda.name.toLowerCase() + '.png);'">
            <h5>{{moeda.name}}</h5>
            <small>1 {{moeda.token}} = {{moeda.price}} BRL</small><br/>
            <small>{{moeda.qty}} {{moeda.token}} = {{this.brl}} {{fromBRL}} BRL</small><br/>
            <input :id="moeda.token" v-model="moeda.qty" @keyup="qtyUpdated"><br/>
        </div>`
})


function convertFromBRL(event) {
    moedas.map(m => m.conversion = m.fromBaseCoin(app.brl));
}


var app = new Vue({
    el: '#app',
    data: {
        brl: baseBRL,
        moedas: moedas
    },
    methods: {
        convertFromBRL: convertFromBRL,
        brlUpdated: function(newBRL) {
            this.brl = newBRL;
        }
    },
    computed: {
        chunkedCoins() {
            return chunk(moedas, 3)
        }
    }
})
