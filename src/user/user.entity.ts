import {BeforeInsert, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { hash } from 'bcrypt';

@Index('abcd_email_unique', ['email'], { unique: true })
@Entity('users', { schema: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
  id: string;

  @Column('varchar', { name: 'name', length: 191 })
  name: string;

  @Column('varchar', { name: 'photo', nullable: true, length: 191 })
  photo: string | null;

  @Column('varchar', { name: 'zip', nullable: true, length: 191 })
  zip: string | null;

  @Column('varchar', { name: 'city', nullable: true, length: 191 })
  city: string | null;

  @Column('varchar', { name: 'country', nullable: true, length: 100 })
  country: string | null;

  @Column('varchar', { name: 'address', nullable: true, length: 191 })
  address: string | null;

  @Column('varchar', { name: 'phone', nullable: true, length: 191 })
  phone: string | null;

  @Column('varchar', { name: 'fax', nullable: true, length: 191 })
  fax: string | null;

  @Column('varchar', { name: 'email', unique: true, length: 191 })
  email: string;

  @Column('varchar', { name: 'token', nullable: true, length: 191 })
  token: string | null;

  @Column({ select: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  @Column('varchar', { name: 'remember_token', nullable: true, length: 100 })
  rememberToken: string | null;

  @Column('timestamp', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('timestamp', { name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @Column('tinyint', { name: 'is_provider', default: () => "'0'" })
  isProvider: number;

  @Column('tinyint', { name: 'status', default: () => "'0'" })
  status: number;

  @Column('text', { name: 'verification_link', nullable: true })
  verificationLink: string | null;

  @Column('text', { name: 'email_verified', nullable: true })
  email_verified: string | null;
  @Column("text", { name: "last_login", nullable: true })
  last_login: string | null;

  @Column('text', { name: 'affilate_code', nullable: true })
  affilateCode: string | null;

  @Column('double', {
    name: 'affilate_income',
    precision: 22,
    default: () => "'0'",
  })
  affilateIncome: number;

  @Column('text', { name: 'f_url', nullable: true })
  fUrl: string | null;

  @Column('text', { name: 'g_url', nullable: true })
  gUrl: string | null;

  @Column('text', { name: 't_url', nullable: true })
  tUrl: string | null;

  @Column('text', { name: 'l_url', nullable: true })
  lUrl: string | null;

  @Column('tinyint', { name: 'is_vendor', width: 1, default: () => "'0'" })
  isVendor: boolean;

  @Column('tinyint', { name: 'f_check', width: 1, default: () => "'0'" })
  fCheck: boolean;

  @Column('tinyint', { name: 'g_check', width: 1, default: () => "'0'" })
  gCheck: boolean;

  @Column('tinyint', { name: 't_check', width: 1, default: () => "'0'" })
  tCheck: boolean;

  @Column('tinyint', { name: 'l_check', width: 1, default: () => "'0'" })
  lCheck: boolean;

  @Column('tinyint', { name: 'mail_sent', width: 1, default: () => "'0'" })
  mailSent: boolean;

  @Column('double', {
    name: 'shipping_cost',
    precision: 22,
    default: () => "'0'",
  })
  shippingCost: number;

  @Column('double', {
    name: 'current_balance',
    precision: 22,
    default: () => "'0'",
  })
  currentBalance: number;

  @Column('date', { name: 'date', nullable: true })
  date: string | null;

  @Column('tinyint', { name: 'ban', width: 1, default: () => "'0'" })
  ban: boolean;
}
