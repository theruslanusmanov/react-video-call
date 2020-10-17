class Streams {

  public mainStreamId = '';
  public mainStream: any;
  public localStream: any;

  private list: any[] = [];

  addStream(stream: any): void {
    this.list.push(stream);
    console.log(this.list);

    let streamId = stream.getId();
    let dom = document.querySelector("#video-item-" + streamId);
    if (!dom) {
      dom = document.createElement("section");
      let box = document.createElement("div");
      dom.setAttribute("id", "video-item-" + streamId);
      dom.setAttribute("class", "video-item");
      box.setAttribute("class", "video-item-box");
      dom.appendChild(box);
      document.body.appendChild(dom);
      stream.play("video-item-" + streamId);
    }
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
