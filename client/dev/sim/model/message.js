"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by kfraser on 02/05/2017.
 */
var Message = (function () {
    function Message(id, text, author, time, image) {
        this.id = id;
        this.text = text;
        this.author = author;
        this.time = time;
        this.image = image;
    }
    return Message;
}());
exports.Message = Message;
