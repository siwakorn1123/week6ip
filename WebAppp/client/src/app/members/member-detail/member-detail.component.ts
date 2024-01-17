import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery'
import { TabsModule } from 'ngx-bootstrap/tabs'
import { Member } from 'src/app/_model/member'
import { MembersService } from 'src/app/_services/members.service'

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css'],
  standalone: true,
  imports: [CommonModule, TabsModule, GalleryModule]
})
export class MemberDetailComponent implements OnInit {
  photos: GalleryItem[] = []
  member: Member | undefined

  constructor(private memberService: MembersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember()
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username')
    if (!username) return
    this.memberService.getMember(username).subscribe({
      next: user => {
        this.member = user
        this.getImages()
      }
    }
    )
  }
  getImages() {
    if (!this.member) return
    for (const photo of this.member.photos) {
      this.photos.push(new ImageItem({ src: photo.url, thumb: photo.url }))
    }
  }
}