import { Callbacks, Lens, transform } from '@vovikilelik/lens-js';

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
    
}

test();