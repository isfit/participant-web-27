import { useEffect, useState } from 'react'
import {getSummary} from '../../utils/summary'
import { getMyApplication } from '../../api/application'

export function SavedApplicationForm() {
    const [userApplication, setUserApplication] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        async function loadApplication() {
            try {
                const response = await getMyApplication()
                if (!cancelled) {
                    setUserApplication(response.data?.application ?? null)
                    setLoading(false)
                }
            } catch (error) {
                if (!cancelled) {
                    setUserApplication(null)
                    setLoading(false)
                }
            }
        }

        loadApplication()

        return () => {
            cancelled = true
        }
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!userApplication) {
        return (
            <div>
                <p>No saved application found.</p>
            </div>
        )
    }

    const summary = getSummary(userApplication)

    return (
        <div>
            {summary}
        </div>
    )
}
