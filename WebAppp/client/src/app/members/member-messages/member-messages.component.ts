import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core'
import { FormsModule, NgForm } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faClock, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { TimeagoModule } from 'ngx-timeago'
import { Message } from 'src/app/_model/message'
import { MessageService } from 'src/app/_services/message.service'
import { NgxLongPress2Module } from 'ngx-long-press2'

@Component({
  standalone: true,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  imports: [CommonModule, FontAwesomeModule, TimeagoModule, FormsModule, NgxLongPress2Module],
  styleUrls: ['./member-messages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class MemberMessagesComponent {
  @Input() username?: string
  @Input() messages: Message[] = []
  faClock = faClock
  faPaperPlane = faPaperPlane
  @ViewChild('messageForm') messageForm?: NgForm
  messageContent = ''


  constructor(public messageService: MessageService) { }

  sendMessage() {
    if (!this.username) return
    this.messageService.sendMessage(this.username, this.messageContent) //เราแก้ไขไปเมื่อกี้ทำให้ ได้ promise กลับมา
      .then(() => {
        this.messageForm?.reset()
      })
  }

  loadMessages() {
    if (!this.username) return

    this.messageService.getMessagesThread(this.username).subscribe({
      next: response => this.messages = response
    })
  }

  ngOnInit(): void {
    this.loadMessages()
  }

  onLongPressMessage(id: number) {
    console.log('delete me, id: ' + id)
    this.messages?.splice(this.messages.findIndex(ms => ms.id === id), 1)
  }
}