type Runnable<T, R> = (v: T) => Promise<R>;
type Predicate<T> = (v: T) => Promise<boolean>

class AsyncIterableWrapper<T> implements AsyncIterable<T> {
    private it: Iterable<T>;

    constructor(it: Iterable<T>) {
        this.it = it;
    }

    [Symbol.asyncIterator] = async function* (): AsyncGenerator<T, void> {
        for (let i of this.it) {
            yield i;
        }
    }
}

export class Stream<T, R> implements AsyncIterable<R> {
    static createStreamSync<T>(it: Iterable<T>): Stream<T, T> {
        return new Stream(new AsyncIterableWrapper(it));
    }

    static createStream<T>(it: AsyncIterable<T>): Stream<T, T> {
        return new Stream(it);
    }

    private it: AsyncIterable<T>;
    private operation: Runnable<T, R>;

    private constructor(it: AsyncIterable<T>, operation?: Runnable<T, R>) {
        this.it = it;
        if (operation === undefined) {
            this.operation = v => v as any;
        }
        else {
            this.operation = operation;
        }
    }

    map<NewR>(pred: Runnable<T, NewR>): Stream<T, NewR> {
        return new Stream(this.it, pred);
    }

    async collect(): Promise<R[]> {
        const ret: R[] = [];

        for await (let i of this) {
            ret.push(i);
        }

        return ret;
    }

    private filterIt = async function* (pred: Predicate<T>, items: T[]): AsyncGenerator<T, void> {
        for (let i of items) {
            if (await pred(i)) {
                yield i;
            }
        }
    }

    async filter(pred: Predicate<T>): Promise<Stream<T, T>> {
        const items: T[] = [];
        for await (let i of this.it) {
            items.push(i);
        }

        return new Stream(this.filterIt(pred, items));
    }

    [Symbol.asyncIterator] = async function* (): AsyncGenerator<R, void> {
        for await (let i of this.it) {
            yield await this.operation(i);
        }
    }
}