import { Counter, NumberBox } from '@interface/ui'
import { useCampaign } from 'context'

export default () => {
  const { campaign, update } = useCampaign()
  const inc = () => {
    update(draft => {
      draft.sessionCount += 1
    })
  }
  const dec = () => {
    update(draft => {
      draft.sessionCount -= 1
    })
  }
  return (
    <NumberBox label='Sessions'>
      <Counter item={campaign} valuePath='sessionCount' inc={inc} dec={dec} />
    </NumberBox>
  )
}
