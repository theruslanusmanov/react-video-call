class Streams {

  public mainStreamId = '';
  public mainStream: any;
  public localStream: any;
  public list: any[] = [];

  addStream(stream: any): void {
    this.list.push(stream);
    console.log(this.list);
  }

  removeStream(id: string): boolean {
    this.list.map((item, index) => {
      if (item.getId() === id) {
        this.list[index].close();
        this.list.splice(index, 1);

        return true;
      }
    });

    return false;
  }

  getStreamById(id: string) {
    return this.list.filter(item => {
      return item.getId() === id;
    })[0];
  };
}

export default Streams;
