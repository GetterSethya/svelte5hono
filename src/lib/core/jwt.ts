import * as Jose from 'jose'

export class JWT {
	private accessSecret: Uint8Array
	private refreshSecret: Uint8Array

	static alg = 'HS256'
	static issuer = 'svelte5hono'
	static audience = 'urn:svelte5hono:audience'
	static accessExp = '6h'
	static refreshExp = '7d'

	constructor(accessSecret: string, refreshSecret: string) {
		const tEnc = new TextEncoder()
		this.accessSecret = tEnc.encode(accessSecret)
		this.refreshSecret = tEnc.encode(refreshSecret)
	}

	public static decode(token: string) {
		return Jose.decodeJwt(token)
	}

	async createAccess(userId: number) {
		const jwt = await new Jose.SignJWT()
			.setProtectedHeader({
				alg: JWT.alg,
			})
			.setIssuedAt()
			.setIssuer(JWT.issuer)
			.setAudience(JWT.audience)
			.setExpirationTime(JWT.accessExp)
			.setSubject(userId.toString())
			.sign(this.accessSecret)

		return jwt
	}

	async createRefresh(userId: number) {
		const jwt = await new Jose.SignJWT()
			.setProtectedHeader({
				alg: JWT.alg,
			})
			.setIssuedAt()
			.setIssuer(JWT.issuer)
			.setAudience(JWT.audience)
			.setExpirationTime(JWT.refreshExp)
			.setSubject(userId.toString())
			.sign(this.refreshSecret)

		return jwt
	}

	async validateAccess(accessToken: string) {
		try {
			return await Jose.jwtVerify(accessToken, this.accessSecret, {
				algorithms: [JWT.alg],
			})
		} catch (error) {
			return null
		}
	}

	async validateRefresh(refreshToken: string) {
		try {
			return await Jose.jwtVerify(refreshToken, this.refreshSecret, {
				algorithms: [JWT.alg],
			})
		} catch (error) {
			return null
		}
	}
}
