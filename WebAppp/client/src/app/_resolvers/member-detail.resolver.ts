import { inject } from '@angular/core'
import { ResolveFn } from '@angular/router'
import { MembersService } from '../_services/members.service'

export const memberDetailResolver: ResolveFn<boolean> = (route, state) => {
  const memberService = inject(MembersService)
  return memberService.getMember(route.paramMap.get('username')!)
}
