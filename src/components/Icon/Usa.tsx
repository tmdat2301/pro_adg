import React, { FC, memo } from 'react';
import Svg, { Path, G, Defs, Rect, ClipPath } from 'react-native-svg';
import { MyIconProps, useMyIconUtils } from '@components/Icon/until';

const Usa: FC<MyIconProps> = (props) => {
  const { modifyProps } = useMyIconUtils(props);
  return (
    <Svg width="26" height="19" viewBox="0 0 26 19" {...modifyProps} fill="none">
      <G clip-path="url(#clip0_1330_32741)">
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 0H36.1004V1.46155H0V0ZM0 2.92311H36.1004V4.38465H0V2.92311ZM0 5.84622H36.1004V7.30776H0V5.84622ZM0 8.76934H36.1004V10.2309H0V8.76934ZM0 11.6924H36.1004V13.154H0V11.6924ZM0 14.6155H36.1004V16.0771H0V14.6155ZM0 17.5386H36.1004V19.0002H0V17.5386Z"
          fill="#BD3D44"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 1.46094H36.1004V2.92249H0V1.46094ZM0 4.38403H36.1004V5.84561H0V4.38403ZM0 7.30714H36.1004V8.76872H0V7.30714ZM0 10.2303H36.1004V11.6918H0V10.2303ZM0 13.1534H36.1004V14.6149H0V13.1534ZM0 16.0765H36.1004V17.538H0V16.0765Z"
          fill="white"
        />
        <Path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H14.44V10.2307H0V0Z" fill="#192F5D" />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M1.205 0.4375L1.33637 0.841844H1.76157L1.41757 1.09178L1.54897 1.49612L1.20496 1.24622L0.861036 1.49612L0.992401 1.09178L0.648438 0.841844H1.0736L1.205 0.4375ZM3.61166 0.4375L3.74306 0.841844H4.16828L3.82426 1.09178L3.95566 1.49612L3.61166 1.24622L3.26773 1.49612L3.3991 1.09178L3.05513 0.841844H3.48029L3.61166 0.4375ZM6.0184 0.4375L6.14978 0.841844H6.57499L6.23097 1.09178L6.36238 1.49612L6.0184 1.24622L5.67446 1.49612L5.80584 1.09178L5.46186 0.841844H5.88707L6.0184 0.4375ZM8.42503 0.4375L8.55641 0.841844H8.98157L8.63759 1.09178L8.76897 1.49612L8.42503 1.24622L8.08105 1.49612L8.21243 1.09178L7.86845 0.841844H8.29365L8.42503 0.4375ZM10.8318 0.4375L10.9632 0.841844H11.3883L11.0443 1.09178L11.1757 1.49612L10.8317 1.24622L10.4878 1.49612L10.6192 1.09178L10.2752 0.841844H10.7004L10.8318 0.4375ZM13.2385 0.4375L13.3699 0.841844H13.7951L13.451 1.09178L13.5825 1.49612L13.2385 1.24622L12.8945 1.49612L13.0259 1.09178L12.6819 0.841844H13.1071L13.2385 0.4375ZM2.40838 1.46061L2.53975 1.86495H2.96495L2.62095 2.11484L2.75239 2.51922L2.40838 2.26933L2.06442 2.51922L2.19579 2.11484L1.85182 1.86495H2.27702L2.40838 1.46061ZM4.81499 1.46061L4.94637 1.86495H5.37153L5.02755 2.11484L5.15893 2.51922L4.81499 2.26933L4.47101 2.51922L4.60239 2.11484L4.25841 1.86495H4.68361L4.81499 1.46061ZM7.22174 1.46061L7.35311 1.86495H7.77828L7.4343 2.11484L7.56572 2.51922L7.2217 2.26933L6.87776 2.51922L7.00914 2.11484L6.66516 1.86495H7.09032L7.22174 1.46061ZM9.62844 1.46061L9.75982 1.86495H10.185L9.84101 2.11484L9.97242 2.51922L9.62844 2.26933L9.28446 2.51922L9.41592 2.11484L9.07194 1.86495H9.49715L9.62844 1.46061ZM12.0351 1.46061L12.1664 1.86495H12.5916L12.2476 2.11484L12.379 2.51922L12.0351 2.26933L11.6911 2.51922L11.8225 2.11484L11.4785 1.86495H11.9037L12.0351 1.46061ZM1.205 2.48367L1.33637 2.88802H1.76157L1.41757 3.13795L1.54897 3.54229L1.20496 3.2924L0.861036 3.54229L0.992401 3.13795L0.648438 2.88802H1.0736L1.205 2.48367ZM3.61166 2.48367L3.74306 2.88802H4.16828L3.82426 3.13795L3.95566 3.54229L3.61166 3.2924L3.26773 3.54229L3.3991 3.13795L3.05513 2.88802H3.48029L3.61166 2.48367ZM6.0184 2.48367L6.14978 2.88802H6.57499L6.23097 3.13795L6.36238 3.54229L6.0184 3.2924L5.67446 3.54229L5.80584 3.13795L5.46186 2.88802H5.88707L6.0184 2.48367ZM8.42503 2.48367L8.55641 2.88802H8.98157L8.63759 3.13795L8.76897 3.54229L8.42503 3.2924L8.08105 3.54229L8.21243 3.13795L7.86845 2.88802H8.29365L8.42503 2.48367ZM10.8318 2.48367L10.9632 2.88802H11.3883L11.0443 3.13795L11.1757 3.54229L10.8317 3.2924L10.4878 3.54229L10.6192 3.13795L10.2752 2.88802H10.7004L10.8318 2.48367ZM13.2385 2.48367L13.3699 2.88802H13.7951L13.451 3.13795L13.5825 3.54229L13.2385 3.2924L12.8945 3.54229L13.0259 3.13795L12.6819 2.88802H13.1071L13.2385 2.48367ZM2.40838 3.50674L2.53975 3.91112H2.96495L2.62095 4.16101L2.75239 4.56539L2.40838 4.3155L2.06442 4.56539L2.19579 4.16101L1.85182 3.91112H2.27702L2.40838 3.50674ZM4.81499 3.50674L4.94637 3.91112H5.37153L5.02755 4.16101L5.15893 4.56539L4.81499 4.3155L4.47101 4.56539L4.60239 4.16101L4.25841 3.91112H4.68361L4.81499 3.50674ZM7.22174 3.50674L7.35311 3.91112H7.77828L7.4343 4.16101L7.56572 4.56539L7.2217 4.3155L6.87776 4.56539L7.00914 4.16101L6.66516 3.91112H7.09032L7.22174 3.50674ZM9.62844 3.50674L9.75982 3.91112H10.185L9.84101 4.16101L9.97242 4.56539L9.62844 4.3155L9.28446 4.56539L9.41588 4.16101L9.0719 3.91112H9.49711L9.62844 3.50674ZM12.0351 3.50674L12.1664 3.91112H12.5916L12.2476 4.16101L12.379 4.56539L12.0351 4.3155L11.6911 4.56539L11.8225 4.16101L11.4785 3.91112H11.9037L12.0351 3.50674ZM1.205 4.52984L1.33637 4.93419H1.76157L1.41757 5.18412L1.54897 5.58846L1.20496 5.33857L0.861036 5.58846L0.992401 5.18412L0.648438 4.93419H1.0736L1.205 4.52984ZM3.61166 4.52984L3.74306 4.93419H4.16828L3.82426 5.18412L3.95566 5.58846L3.61166 5.33857L3.26773 5.58846L3.3991 5.18412L3.05513 4.93419H3.48029L3.61166 4.52984ZM6.0184 4.52984L6.14978 4.93419H6.57499L6.23097 5.18412L6.36238 5.58846L6.0184 5.33857L5.67446 5.58846L5.80584 5.18412L5.46186 4.93419H5.88707L6.0184 4.52984ZM8.42503 4.52984L8.55641 4.93419H8.98157L8.63759 5.18412L8.76897 5.58846L8.42503 5.33857L8.08105 5.58846L8.21243 5.18412L7.86845 4.93419H8.29365L8.42503 4.52984ZM10.8318 4.52984L10.9632 4.93419H11.3883L11.0443 5.18412L11.1757 5.58846L10.8317 5.33857L10.4878 5.58846L10.6192 5.18412L10.2752 4.93419H10.7004L10.8318 4.52984ZM13.2385 4.52984L13.3699 4.93419H13.7951L13.451 5.18412L13.5825 5.58846L13.2385 5.33857L12.8945 5.58846L13.0259 5.18412L12.6819 4.93419H13.1071L13.2385 4.52984ZM2.40838 5.55291L2.53975 5.9573H2.96495L2.62095 6.20719L2.75239 6.61157L2.40838 6.36168L2.06442 6.61157L2.19579 6.20719L1.85182 5.9573H2.27702L2.40838 5.55291ZM4.81499 5.55291L4.94637 5.9573H5.37153L5.02755 6.20719L5.15893 6.61157L4.81499 6.36168L4.47101 6.61157L4.60239 6.20719L4.25841 5.9573H4.68361L4.81499 5.55291ZM7.22174 5.55291L7.35311 5.9573H7.77828L7.4343 6.20719L7.56572 6.61157L7.2217 6.36168L6.87776 6.61157L7.00914 6.20719L6.66516 5.9573H7.09032L7.22174 5.55291ZM9.62844 5.55291L9.75982 5.9573H10.185L9.84101 6.20719L9.97242 6.61157L9.62844 6.36168L9.28446 6.61157L9.41588 6.20719L9.0719 5.9573H9.49711L9.62844 5.55291ZM12.0351 5.55291L12.1664 5.9573H12.5916L12.2476 6.20719L12.379 6.61157L12.0351 6.36168L11.6911 6.61157L11.8225 6.20719L11.4785 5.9573H11.9037L12.0351 5.55291ZM1.205 6.57603L1.33637 6.98037H1.76157L1.41757 7.2303L1.54897 7.63464L1.20496 7.38475L0.861036 7.63464L0.992401 7.2303L0.648438 6.98037H1.0736L1.205 6.57603ZM3.61166 6.57603L3.74306 6.98037H4.16828L3.82426 7.2303L3.95566 7.63464L3.61166 7.38475L3.26773 7.63464L3.3991 7.2303L3.05513 6.98037H3.48029L3.61166 6.57603ZM6.0184 6.57603L6.14978 6.98037H6.57499L6.23097 7.2303L6.36238 7.63464L6.0184 7.38475L5.67446 7.63464L5.80584 7.2303L5.46186 6.98037H5.88707L6.0184 6.57603ZM8.42503 6.57603L8.55641 6.98037H8.98157L8.63759 7.2303L8.76897 7.63464L8.42503 7.38475L8.08105 7.63464L8.21243 7.2303L7.86845 6.98037H8.29365L8.42503 6.57603ZM10.8318 6.57603L10.9632 6.98037H11.3883L11.0443 7.2303L11.1757 7.63464L10.8317 7.38475L10.4878 7.63464L10.6192 7.2303L10.2752 6.98037H10.7004L10.8318 6.57603ZM13.2385 6.57603L13.3699 6.98037H13.7951L13.451 7.2303L13.5825 7.63464L13.2385 7.38475L12.8945 7.63464L13.0259 7.2303L12.6819 6.98037H13.1071L13.2385 6.57603ZM2.40838 7.5991L2.53975 8.00348H2.96495L2.62095 8.25337L2.75239 8.65775L2.40838 8.40786L2.06442 8.65775L2.19579 8.25337L1.85182 8.00348H2.27702L2.40838 7.5991ZM4.81499 7.5991L4.94637 8.00348H5.37153L5.02755 8.25337L5.15893 8.65775L4.81499 8.40786L4.47101 8.65775L4.60239 8.25337L4.25841 8.00348H4.68361L4.81499 7.5991ZM7.22174 7.5991L7.35311 8.00348H7.77828L7.4343 8.25337L7.56572 8.65775L7.2217 8.40786L6.87776 8.65775L7.00914 8.25337L6.66516 8.00348H7.09032L7.22174 7.5991ZM9.62844 7.5991L9.75982 8.00348H10.185L9.84101 8.25337L9.97242 8.65775L9.62844 8.40786L9.28446 8.65775L9.41588 8.25337L9.0719 8.00348H9.49711L9.62844 7.5991ZM12.0351 7.5991L12.1664 8.00348H12.5916L12.2476 8.25337L12.379 8.65775L12.0351 8.40786L11.6911 8.65775L11.8225 8.25337L11.4785 8.00348H11.9037L12.0351 7.5991ZM1.205 8.62221L1.33637 9.02655H1.76157L1.41757 9.27648L1.54897 9.68082L1.20496 9.43093L0.861036 9.68082L0.992401 9.27648L0.648438 9.02655H1.0736L1.205 8.62221ZM3.61166 8.62221L3.74306 9.02655H4.16828L3.82426 9.27648L3.95566 9.68082L3.61166 9.43093L3.26773 9.68082L3.3991 9.27648L3.05513 9.02655H3.48029L3.61166 8.62221ZM6.0184 8.62221L6.14978 9.02655H6.57499L6.23097 9.27648L6.36238 9.68082L6.0184 9.43093L5.67446 9.68082L5.80584 9.27648L5.46186 9.02655H5.88707L6.0184 8.62221ZM8.42503 8.62221L8.55641 9.02655H8.98157L8.63759 9.27648L8.76897 9.68082L8.42503 9.43093L8.08105 9.68082L8.21243 9.27648L7.86845 9.02655H8.29365L8.42503 8.62221ZM10.8318 8.62221L10.9632 9.02655H11.3883L11.0443 9.27648L11.1757 9.68082L10.8317 9.43093L10.4878 9.68082L10.6192 9.27648L10.2752 9.02655H10.7004L10.8318 8.62221ZM13.2385 8.62221L13.3699 9.02655H13.7951L13.451 9.27648L13.5825 9.68082L13.2385 9.43093L12.8945 9.68082L13.0259 9.27648L12.6819 9.02655H13.1071L13.2385 8.62221Z"
          fill="white"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1330_32741">
          <Rect width="25.3333" height="19" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default memo(Usa);
