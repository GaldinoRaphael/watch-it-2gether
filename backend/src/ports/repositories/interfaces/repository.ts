export interface Repository<T> {
    getByID(id: string): Promise<T | null>;
    getAll(): Promise<T[]>;
    save(entity: T): Promise<T>;
    update(id: string, entity: T): Promise<T>;
    delete(id: string): Promise<void>;
}