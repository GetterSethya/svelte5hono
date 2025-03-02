import { createMiddleware } from 'hono/factory'
import { AuthenticationRepository } from '../repository/auth-repository.js'
import { CompanyRepository } from '../repository/company-repository.js'
import { UserRepository } from '../repository/user-repository.js'
import { ApplicationRepository } from '../repository/application-repository.js'

export type RepositoryMiddleware = {
	Variables: {
		authRepo: AuthenticationRepository
		userRepo: UserRepository
		companyRepo: CompanyRepository
		applicationRepo: ApplicationRepository
	}
}

export const repositoryMiddleware = createMiddleware<RepositoryMiddleware>(async (c, next) => {
	c.set('authRepo', new AuthenticationRepository())
	c.set('userRepo', new UserRepository())
	c.set('companyRepo', new CompanyRepository())
	c.set('applicationRepo', new ApplicationRepository())

	await next()
})
