'use client'

import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

type FormValues = {
  username: string
  password: string
}

const LoginClient = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    const res = await signIn('credentials', { ...data, redirect: false })
    if (res?.ok) router.push('/')
    else setError('root', { message: t('invalidCredentials') })
  }

  return (
    <div className="container py-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">{t('loginTitle')}</h2>

      {errors.root && (
        <div className="alert alert-danger">{errors.root.message}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <input
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            placeholder={t('usernamePlaceholder')}
            {...register('username', {
              required: t('usernameRequired'),
            })}
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username.message}</div>
          )}
        </div>

        <div className="mb-3">
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            placeholder={t('passwordPlaceholder')}
            {...register('password', {
              required: t('passwordRequired'),
            })}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password.message}</div>
          )}
        </div>

        <button type="submit" className="btn btn-success w-100">
          {t('loginButton')}
        </button>
      </form>
    </div>
  )
}

export default LoginClient