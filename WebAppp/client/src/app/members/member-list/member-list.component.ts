import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'
import { Member } from 'src/app/_services/_model/member'
import { MembersService } from 'src/app/_services/members.service'

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  // members: Member[] = []
  members$: Observable<Member[]> | undefined

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.members$ = this.memberService.getMembers()
  }

  // loadMember() {
  //   this.memberService.getMembers().subscribe({
  //     next: resp => {
  //       this.members = resp
  //     },

  //   })
  // }
}
