import { Observable, Observer } from 'rxjs';
import { Frame } from './models/Frame';

export default (ms: number) => {
    return Observable.create((observer: Observer<Frame>) => {
        setInterval(() => {
            observer.next({
                delta: 4,
            })
        }, ms);
    })
}