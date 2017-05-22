/**
 * Created by kfraser on 02/05/2017.
 */
export class Message {
  constructor(
    public id: number,
    public text: string,
    public author: string,
    public time: string,
    public image: string
  ){}
}
