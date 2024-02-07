import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { User } from '../_model/user'
import { Member } from '../_model/member'
import { map, of, take } from 'rxjs'
import { PaginationResult } from '../_model/pagination'
import { UserParams } from '../_model/UserParams'
import { AccountService } from './account.service'
import { getPaginationHeaders, getPaginationResult } from './paginationHelper'
import { ListParams } from '../_model/listparams'

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  // userParams: UserParams | undefined
  user: User | undefined
  memberCache = new Map()
  baseUrl = environment.apiUrl
  members: Member[] = []

  //paginationResult: PaginationResult<Member[]> = new PaginationResult<Member[]>

  constructor(private http: HttpClient, private accountService: AccountService,) {
    // this.accountService.currentUser$.pipe(take(1)).subscribe({
    //   next: user => {
    //     if (user) {
    //       this.userParams = new UserParams(user)
    //       this.user = user
    //     }
    //   }
    // })
  }



  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {})
  }

  getLikes(listParams: ListParams) {
    // let params = getPaginationHeaders(pageNumber, pageSize)
    let httpParams = getPaginationHeaders(listParams.pageNumber, listParams.pageSize)
    // params = params.append('predicate', predicate)
    const url = this.baseUrl + 'likes'
    return getPaginationResult<Member[]>(url, httpParams, this.http)
  }
  // getHttpOptions() {
  //   const userString = localStorage.getItem('user')
  //   if (!userString) return
  //   const user: User = JSON.parse(userString)
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.token
  //     })
  //   }
  // }
  private _key(userParams: UserParams) {
    return Object.values(userParams).join('_')
  }
  // private getPaginationHeaders(pageNumber: number, pageSize: number) {
  //   let params = new HttpParams()
  //   params = params.append('pageNumber', pageNumber)
  //   params = params.append('pageSize', pageSize)
  //   return params
  // }
  // private getPaginationResult<T>(url: string, params: HttpParams,) {
  //   const paginationResult: PaginationResult<T> = new PaginationResult<T>
  //   return this.http.get<T>(url, { observe: 'response', params }).pipe(
  //     map(response => {
  //       if (response.body)
  //         paginationResult.result = response.body

  //       const pagination = response.headers.get('Pagination')
  //       if (pagination)
  //         paginationResult.pagination = JSON.parse(pagination)

  //       return paginationResult
  //     })
  //   )
  // }

  getMembers(userParams: UserParams) {
    const key = this._key(userParams)
    const response = this.memberCache.get(key)
    if (response) return of(response)
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize)
    params = params.append('minAge', userParams.minAge)
    params = params.append('maxAge', userParams.maxAge)
    params = params.append('gender', userParams.gender)
    params = params.append('orderBy', userParams.orderBy)
    const url = this.baseUrl + 'users'
    return getPaginationResult<Member[]>(url, params, this.http).pipe(
      map(response => {
        this.memberCache.set(key, response)
        return response
      })
    )
  }

  getMember(username: string) {
    // const member = this.members.find(user => user.userName === username)
    // if (member) return of(member)
    const cache = [...this.memberCache.values()]
    // console.log('cache\n', cache)
    const members = cache.reduce((arr, item) => arr.concat(item.result), [])
    // console.log('members\n', members)
    const member = members.find((member: Member) => member.userName === username)
    // console.log('member\n', member)
    // const member = [...this.memberCache.values()].reduce((arr, item) => arr.concat(item.result), [])
    //              .find((member: Member) => member.userName === username)
    if (member) return of(member)

    return this.http.get<Member>(this.baseUrl + 'users/username/' + username)
  }
  updateProfile(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(_ => {
        const index = this.members.indexOf(member)
        this.members[index] = { ...this.members[index], ...member }
      })
    )
  }
  setMainPhoto(photoId: number) {
    const endpoint = this.baseUrl + 'users/set-main-photo/' + photoId
    return this.http.put(endpoint, {})
  }
  deletePhoto(photoId: number) {
    const endpoint = this.baseUrl + 'users/delete-photo/' + photoId
    return this.http.delete(endpoint)
  }
}

