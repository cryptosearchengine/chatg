import { EModelEndpoint } from 'librechat-data-provider';
import { useGetEndpointsQuery, useGetStartupConfig } from 'librechat-data-provider/react-query';
import { type ReactNode } from 'react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '~/components/ui';
import { useChatContext, useAssistantsMapContext } from '~/Providers';
import { icons } from './Menus/Endpoints/Icons';
import { BirthdayIcon } from '~/components/svg';
import { getEndpointField } from '~/utils';
import { useLocalize } from '~/hooks';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import store from '~/store';
import RoomCreate from '../SidePanel/RoomCreate';

export default function Landing({ Header }: { Header?: ReactNode }) {
  const { conversationId } = useParams();
  const { conversation } = useChatContext();
  const { data: endpointsConfig } = useGetEndpointsQuery();
  const { data: startupConfig } = useGetStartupConfig();
  const assistantMap = useAssistantsMapContext();
  const convoType = useRecoilValue(store.convoType);

  const localize = useLocalize();

  let { endpoint } = conversation ?? {};
  const { assistant_id = null } = conversation ?? {};

  if (
    endpoint === EModelEndpoint.chatGPTBrowser ||
    endpoint === EModelEndpoint.azureOpenAI ||
    endpoint === EModelEndpoint.gptPlugins
  ) {
    endpoint = EModelEndpoint.openAI;
  }

  const endpointType = getEndpointField(endpointsConfig, endpoint, 'type');
  const iconURL = getEndpointField(endpointsConfig, endpoint, 'iconURL');
  const iconKey = endpointType ? 'unknown' : endpoint ?? 'unknown';
  const Icon = icons[iconKey];

  const assistant = endpoint === EModelEndpoint.assistants && assistantMap?.[assistant_id ?? ''];
  const assistantName = (assistant && assistant?.name) || '';
  const assistantDesc = (assistant && assistant?.description) || '';
  const avatar = (assistant && (assistant?.metadata?.avatar as string)) || '';

  let className =
    'shadow-stroke relative flex h-full items-center justify-center rounded-full bg-white text-black';

  if (assistantName && avatar) {
    className = 'shadow-stroke overflow-hidden rounded-full';
  }

  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <div className="relative h-full">
          {!(convoType === 'r' && conversationId === 'new') && (
            <div className="absolute left-0 right-0">{Header && Header}</div>
          )}
          <div className="flex h-full flex-col items-center justify-center">
            <div className="relative mb-3 h-[72px] w-[72px]">
              <div className={className}>
                {endpoint &&
                  endpoint !== EModelEndpoint.sdImage &&
                  Icon &&
                  Icon({
                    size: 41,
                    context: 'landing',
                    className: 'h-2/3 w-2/3',
                    endpoint: endpoint,
                    iconURL: iconURL,
                    assistantName,
                    avatar,
                  })}
                {endpoint && endpoint === EModelEndpoint.sdImage && (
                  <img
                    src={
                      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
                        ? '/assets/sdimage.png'
                        : '/assets/sdimage.png'
                    }
                    alt="sdimage"
                    width="20"
                    height="20"
                  />
                )}
              </div>
              <TooltipTrigger>
                {(startupConfig?.showBirthdayIcon ?? false) && (
                  <BirthdayIcon className="absolute bottom-12 right-5" />
                )}
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={115} className="left-[20%]">
                {localize('com_ui_happy_birthday')}
              </TooltipContent>
            </div>
            {assistantName ? (
              <div className="flex flex-col items-center gap-0 p-2">
                <div className="text-center text-2xl font-medium dark:text-white">
                  {assistantName}
                </div>
                <div className="text-token-text-secondary max-w-md text-center text-xl font-normal ">
                  {assistantDesc ? assistantDesc : localize('com_nav_welcome_message')}
                </div>
              </div>
            ) : convoType === 'r' ? (
              conversationId === 'new' ? (
                <RoomCreate />
              ) : (
                <div className="mb-5 text-2xl font-medium dark:text-white">
                  {localize('com_nav_welcome_message')}
                </div>
              )
            ) : (
              <div className="mb-5 text-2xl font-medium dark:text-white">
                {localize('com_nav_welcome_message')}
              </div>
            )}
          </div>
        </div>
      </Tooltip>
    </TooltipProvider>
  );
}
