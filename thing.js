function bin(n,d) {
    var o = [];
    for(var i=d-1;i>=0;i--) {
        o.push((n & (1<<i))>>i);
    }
    return o;
}

function createElement(name,attrs,content) {
    var e = document.createElement(name)
        for(var key in attrs) {
            e.setAttribute(key,attrs[key]);
        }
    if(content!==undefined) {
        e.textContent = content;
    }
    return e;
}

var things = document.getElementById('things');


function removes(list) {
    var last = [0,0,0,0];
    var t = 0
        list.forEach(function(l) {
            for(var i=0;i<last.length;i++) {
                if(l.b[i]<last[i]) {
                    t += 1;
                }
            }
            last = l.b;
        });
    return t;
}

function Interactive() {
    this.data = [];
    this.make_things(5);
}
Interactive.prototype = {
    make_things: function(fingers,seq) {
        this.fingers = fingers;
        var d;
        if(!this.data[this.fingers]) {
            d = this.data[this.fingers] = {list:[],best:Infinity};
            for(var i=0;i<Math.pow(2,fingers);i++) {
                d.list.push({n:i,b:bin(i,fingers)});
            }
        }
        d = this.data[this.fingers];
        things.innerHTML = '';
        if(!seq) {
            seq = [];
            for(var i=0;i<Math.pow(2,fingers);i++) {
                seq.push(i);
            }
        }
        seq.forEach(function(i) {
            var li = createElement('li');
            li.classList.add('thing');
            var b = d.list[i].b;
            var bits = b.map(function(d){
                var e = createElement('span',{'class':'bin'});
                if(d) {
                    e.classList.add('on');
                }
                li.appendChild(e);
                return e;
            });
            li.appendChild(createElement('span',{'class':'number'},i))
            things.appendChild(li);
        });

        this.update();
    },

    move_thing: function(oldIndex,newIndex) {
        var list = this.data[this.fingers].list;
        var o = list.splice(oldIndex,1)[0];
        list.splice(newIndex,0,o);
        this.update();
    },

    update: function() {
        var d = this.data[this.fingers];
        var r = removes(d.list);
        var seq = d.list.map(function(t){return t.n}).join(',');
        document.querySelector('#removes .number').textContent = r;
        if(r<d.best) {
            d.best = r;
            d.best_seq = d.list.map(function(t){return t.n});
            document.querySelector('#best-removes .number').textContent = r;
        }
//        document.getElementById('sequence').value = seq;
        var top_bins = document.querySelectorAll('#things li:first-child .bin');
        for(var i=0;i<top_bins.length;i++) {
            top_bins[i].classList.remove('remove');
        }
        for(var i=1;i<d.list.length;i++) {
            var bins = document.querySelectorAll('#things li')[i];
            for(var j=0;j<this.fingers;j++) {
                var bin = bins.querySelectorAll('.bin')[j];
                if(d.list[i-1].b[j] && !d.list[i].b[j]) {
                    bin.classList.add('remove');
                } else {
                    bin.classList.remove('remove');
                }
            }
        }
    }

}

var sortable = Sortable.create(things,{onEnd: function(evt) {
    interactive.move_thing(evt.oldIndex,evt.newIndex);
}});
var interactive = new Interactive();

function valid_sequence(seq) {
    var set = seq.slice().sort(function(a,b){return a<b ? -1 : a>b ? 1 : 0});
    return set.every(function(v,i){return v==i});
}

/*
document.getElementById('sequence').addEventListener('change',function() {
    var seq = document.getElementById('sequence').value.split(',').map(function(v){return parseInt(v)});
    if(!valid_sequence(seq)) {
        return;
    }
    var t = 1;
    var p = 0;
    while(t<seq.length) {
        t *= 2;
        p += 1;
    }
    interactive.make_things(p,seq);
});
*/
document.getElementById('num_fingers').addEventListener('input',function() {
    interactive.make_things(document.getElementById('num_fingers').value);
    document.querySelector('#best-removes .number').textContent = interactive.data[interactive.fingers].best;
});
document.getElementById('best-removes').addEventListener('click',function() {
    interactive.make_things(interactive.fingers,interactive.data[interactive.fingers].best_seq);
});
