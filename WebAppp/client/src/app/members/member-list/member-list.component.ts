import { Component, OnInit } from '@angular/core'
import { Observable, take } from 'rxjs'
import { UserParams } from 'src/app/_model/UserParams'
import { Member } from 'src/app/_model/member'
import { Pagination } from 'src/app/_model/pagination'
import { User } from 'src/app/_model/user'
import { AccountService } from 'src/app/_services/account.service'
import { MembersService } from 'src/app/_services/members.service'

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[] = []
  pagination: Pagination | undefined
  userParams: UserParams | undefined
  user: User | undefined

  genderList = [
    { value: 'male', display: 'Male' },
    { value: 'female', display: 'Female' },
    { value: 'non-binary', display: 'Non-binary' },
  ]
  constructor(private accountService: AccountService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user
      }
    })
  }
  // this.accountService.currentUser$.pipe(take(1)).subscribe({
  //   next: user => {
  //     if (user) {
  //       this.userParams = new UserParams(user)
  //       this.user = user
  //     }
  //   }
  // })

  ngOnInit(): void {
    this.resetFilters()
    if (this.user) {
      const paramsString = localStorage.getItem('userParams')
      if (paramsString) {
        const localParams = JSON.parse(paramsString)
        if (localParams.username === this.user.username)
          this.userParams = localParams.params
      }
    }
    this.loadMember()
  }

  loadMember() {
    if (this.userParams) {
      this._saveParams()
      this.memberService.getMembers(this.userParams).subscribe({
        next: response => {
          if (response.result && response.pagination) {
            this.members = response.result
            this.pagination = response.pagination
          }
        }
      })
    }
  }

  pageChanged(event: any) {
    if (!this.userParams) return
    if (this.userParams.pageNumber === event.page) return
    this.userParams.pageNumber = event.page
    this.loadMember()
  }

  resetFilters() {
    if (this.user)
      this.userParams = new UserParams(this.user)
  }

  private _saveParams() {
    if (this.user)
      localStorage.setItem('userParams', JSON.stringify({
        username: this.user.username,
        params: this.userParams
      }))
  }

}
