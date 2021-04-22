import { Lens, LensUtils } from '@vovikilelik/lens-ts';

interface Props {
    world: string;
}
  
function hello(props: Props) {
    alert(`Hello, ${props.world}`);
}

// hello({ world: 'TypeScript!' });

type Table = {
    apple: number;
    orange: string;
}

type Ficus = {
    one: number;
    two: string;
}

type Store = {
    basket: string;
    table: Table;
    arr: Ficus[];
};

const test = () => {
    const store = { lens: {arr: [], basket: '', table: {apple: 0, orange: ''}} };

    const lens = new Lens<Store>(() => store.lens, (value, e) => {store.lens = value; e()});
    
    console.log(JSON.stringify(store));
    
    const getter = (v: Table) => ({one: v.apple, two: v.orange});
    const setter = (v: Ficus) => ({apple: v.one, orange: v.two});

    lens.attach(e => {
        console.log('root', e);
    });

    const x = lens.go<Ficus>('table', LensUtils.getMapper(getter, setter));

    x.attach(e => {
        console.log(e);
    });

    x.attach(LensUtils.getStrictCallback(e => {
        console.log('strict', e);
    }));

    x.go('one').attach(LensUtils.getStrictCallback(e => {
        console.log('strict one', e);
    }));
    
    x.go('two').attach(LensUtils.getStrictCallback(e => {
        console.log('strict two', e);
    }));

    console.log('-------------');
    x.go('one').set(111);
    console.log('-------------');
    x.go('two').set('aaa');
    console.log('-------------');
    x.set({one: 9, two: 'x'});

    console.log(JSON.stringify(store));
    
    const y = LensUtils.getArray<Ficus>(lens.go('arr'));
    y.forEach(i => {
        const c = i.get();
        
    });
}

test();