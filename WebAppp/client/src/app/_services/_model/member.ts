export interface Member {
    id: number
    userName: string
    age: number
    aka: string
    gender: string
    introduction: string
    lookingFor: string
    interests: string
    city: string
    country: string
    photos: Photo[]
    created: Date
    lastActive: Date
    mainPhotoUrl: string
}

export interface Photo { //quick fix (ctrl+.) move to new file
    id: number
    url: string
    isMain: boolean
}