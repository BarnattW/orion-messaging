class Node<T> {
	data: T;
	previous: Node<T> | null;
	next: Node<T> | null;

	constructor(data: any) {
		this.data = data;
		this.previous = null;
		this.next = null;
	}
}

export class Queue<T> {
	private head: Node<T> | null;
	private tail: Node<T> | null;

	constructor(queue?: Queue<T>) {
		this.head = null;
		this.tail = null;

		if (queue) {
			let current = queue.head;
			while (current) {
				this.offer(current.data);
				current = current.next;
			}
		}
	}

	public offer(data: T): void {
		const newNode = new Node<T>(data);

		if (this.head === null) {
			this.head = newNode;
			this.tail = newNode;
		} else {
			newNode.previous = this.tail;
			this.tail!.next = newNode;
			this.tail = newNode;
		}
	}

	public poll(): T | null {
		if (this.head === null) return null;

		const removedNode = this.head;

		if (this.head === this.tail) {
			this.head = null;
			this.tail = null;
		} else {
			this.head = this.head.next;
			this.head!.previous = null;
		}

		return removedNode.data;
	}

	public isEmpty(): boolean {
		return this.head === null;
	}

	public peek(): T | null {
		if (this.head === null) return null;
		return this.head.data;
	}
}
