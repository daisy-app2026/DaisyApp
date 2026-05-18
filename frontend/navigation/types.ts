import { Entry } from '../services/entryService'

export type AuthStackParamList = {
  Splash: undefined
  Login: undefined
  Signup: undefined
}

export type DiaryStackParamList = {
  Home: undefined
  Category: {
    spaceId: string
    spaceName: string
    spaceIcon: string
    spaceIconBg: string
    spaceIconBgLight: string
  }
  NewEntry: {
    spaceId: string
    spaceName: string
    spaceIcon: string
    editEntry?: Entry
  }
  ViewEntry: {
    entry: Entry
  }
  Search: undefined
  Profile: undefined
  Disclaimer: undefined
}

export type TalkToPastStackParamList = {
  TalkToPastHome: undefined
  TalkToPastIntro: undefined
  TalkToPastSection: {
    sectionNumber: 1 | 2 | 3 | 4
    personName: string
    answers: Record<string, string>
  }
  TalkToPastChat: {
    sessionId: string
    personName: string
    answers: Record<string, any>
    initialMessages?: {
      id: string
      text: string
      isUser: boolean
      timestamp: string
    }[]
  }
}

export type TalkToCrushStackParamList = {
  TalkToCrushHome: undefined
}

export type MainTabParamList = {
  DiaryTab: undefined
  TalkToPastTab: undefined
  TalkToCrushTab: undefined
}
