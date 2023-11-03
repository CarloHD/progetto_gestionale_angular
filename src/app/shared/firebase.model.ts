export interface resAuth {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  registered?: boolean
}

export interface bodyAuth {
  email: string
  password: string
  returnSecureToken: boolean
}

export interface resStore {
  name: string
}

export interface resErrorAuth {
  error: {
    errors: [
      {
        domain: string
        reason: string
        message: string
      }
    ]
    code: number
    message: string
  }
}
