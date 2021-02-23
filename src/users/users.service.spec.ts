import { Test } from "../../node_modules/@nestjs/testing";
import { UserService } from "./users.service";
import { User } from "./entities/user.entity";
import { getRepositoryToken } from "../../node_modules/@nestjs/typeorm";
import { Verification } from "./entities/verification.entity";
import { JwtService } from "../jwt/jwt.service";
import { MailService } from "../mail/mail.service";
import { Repository } from "../../node_modules/typeorm";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
    let service: UserService;
    let usersRepository: MockRepository<User>;

    const mockRepository = {
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
    };

    const mockJwtRepository = {
        sign: jest.fn(),
        verify: jest.fn(),
    };

    const mockMailRepository = {
        sendVerificationEmail: jest.fn()
    }

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository
                },
                {
                    provide: getRepositoryToken(Verification),
                    useValue: mockRepository
                },
                {
                    provide: JwtService,
                    useValue: mockJwtRepository
                },
                {
                    provide: MailService,
                    useValue: mockMailRepository
                }
            ],
        }).compile();
        service = module.get<UserService>(UserService);
        usersRepository = module.get(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createAccount', () => {
        it('should fail if user exists', async () => {
            usersRepository.findOne.mockResolvedValue({
                id: 1,
                email: '',
            });
            const result = await service.createAccount({
                email: '2',
                password: '',
                role: 0,
            });
            expect(result).toMatchObject({
                ok: false,
                error: 'There is a user with that email already',
            });
        });
    });

    it.todo('createAccount');
    it.todo('login');
    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
});