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
    let service: UserService;Verification
    let usersRepository: MockRepository<User>;
    let verificationRepository: MockRepository<Verification>;
    let mailService: MailService;

    const mockRepository = () => ({
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
    });

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
                    useValue: mockRepository(),
                },
                {
                    provide: getRepositoryToken(Verification),
                    useValue: mockRepository(),
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
        verificationRepository = module.get(getRepositoryToken(Verification));
        mailService = module.get<MailService>(MailService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    
    describe('createAccount', () => {
        const createAccountArgs = {
            email: '',
            password: '',
            role: 0,
        };
        it('should fail if user exists', async () => {
            //Promise의 ResolverdValue를 속일 것이다.
            //jest가 중간에 fineOne 함수를 가로채고 반환 값을 속일 것이다.
            usersRepository.findOne.mockResolvedValue({
                id: '1',
                email: '',
            });
            const result = await service.createAccount(createAccountArgs);
            expect(result).toMatchObject({
                ok: false,
                error: 'There is a user with that email already',
            });
        });
            it('should create a new User', async () => {
                usersRepository.findOne.mockResolvedValue(undefined);
                usersRepository.create.mockReturnValue(createAccountArgs);
                usersRepository.save.mockResolvedValue(createAccountArgs);
                verificationRepository.create.mockReturnValue(createAccountArgs);
                verificationRepository.save.mockResolvedValue({
                    code: 'code',
                });

                const result = await service.createAccount(createAccountArgs);
                expect(usersRepository.create).toHaveBeenCalledTimes(1);
                expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

                expect(usersRepository.save).toHaveBeenCalledTimes(1);
                expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

                expect(verificationRepository.create).toHaveBeenCalledTimes(1);
                expect(verificationRepository.create).toHaveBeenCalledWith({
                    user: createAccountArgs
                });
                
                expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
                expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
                    expect.any(String),
                    expect.any(String),
                );

                expect(result).toEqual({ok :true});
                });
            });

    it.todo('createAccount');
    it.todo('login');
    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
});